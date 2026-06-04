# coding=utf-8
"""
股票池选股器 - 简化版
直接在掘金终端运行，无需配置
"""
from __future__ import print_function, absolute_import, unicode_literals
from gm.api import *
import datetime
import pandas as pd


def select_stocks():
    """执行选股"""
    now_str = datetime.datetime.now().strftime('%Y-%m-%d')
    print("=" * 60)
    print("股票池选股器 - 简化版")
    print(f"选股日期: {now_str}")
    print("=" * 60)
    
    try:
        # 获取沪深300成分股
        print("\n1. 获取沪深300成分股...")
        constituents = stk_get_index_constituents(
            index='SHSE.000300',
            trade_date=now_str
        )
        
        if constituents is None or len(constituents) == 0:
            print("❌ 无法获取成分股")
            return
        
        symbols = list(constituents['symbol'])
        print(f"✅ 获取到 {len(symbols)} 只成分股")
        
        # 获取股票数据
        print("\n2. 获取股票数据...")
        results = []
        
        for idx, symbol in enumerate(symbols[:30]):  # 先取30只测试
            try:
                # 获取价格数据
                price_data = history_n(
                    symbol=symbol,
                    frequency='1d',
                    count=20,
                    fields='close',
                    fill_missing='Last',
                    adjust=ADJUST_PREV,
                    end_time=now_str,
                    df=True
                )
                
                if price_data is None or len(price_data) < 10:
                    continue
                
                prices = price_data['close'].values
                momentum = (prices[-1] / prices[0]) - 1
                
                # 获取市值
                mv_data = stk_get_daily_mktvalue_pt(
                    symbols=[symbol],
                    fields='tot_mv',
                    trade_date=now_str,
                    df=True
                )
                tot_mv = float(mv_data['tot_mv'].iloc[0]) if not mv_data.empty else 0
                
                # 获取财务数据
                fin_data = get_financial_report(
                    symbol=symbol,
                    fields='pe_ttm,roe',
                    report_type=REPORT_TYPE_QUARTER,
                    end_time=now_str,
                    df=True
                )
                pe = float(fin_data['pe_ttm'].iloc[0]) if not fin_data.empty and not pd.isna(fin_data['pe_ttm'].iloc[0]) else 40
                roe = float(fin_data['roe'].iloc[0]) if not fin_data.empty and not pd.isna(fin_data['roe'].iloc[0]) else 0.1
                
                results.append({
                    'symbol': symbol,
                    'name': symbol.split('.')[-1],
                    'close': prices[-1],
                    'tot_mv': tot_mv,
                    'pe_ttm': pe,
                    'roe': roe,
                    'momentum': momentum
                })
                
            except Exception as e:
                if idx % 10 == 0:
                    print(f"  处理 {symbol} 失败: {e}")
        
        if not results:
            print("❌ 未获取到任何股票数据")
            return
        
        # 转换为DataFrame并评分
        df = pd.DataFrame(results)
        
        # 简单评分：动量 + 质量
        df['score'] = df['momentum'] * 0.6 + df['roe'] * 0.4
        
        # 筛选市值>50亿的
        df = df[df['tot_mv'] >= 50]
        
        # 按评分排序
        df = df.sort_values('score', ascending=False).head(10)
        
        # 输出结果
        print("\n3. 选股结果:")
        print("-" * 80)
        print(f"{'排名':^4} {'代码':^12} {'名称':^8} {'收盘价':^8} {'PE':^6} {'ROE(%)':^8} {'动量(%)':^10} {'市值(亿)':^10}")
        print("-" * 80)
        
        for i, (_, row) in enumerate(df.iterrows(), 1):
            print(f"{i:^4} {row['symbol']:^12} {row['name']:^8} {row['close']:^8.2f} {row['pe_ttm']:^6.1f} "
                  f"{row['roe']*100:^8.1f} {row['momentum']*100:^10.1f} {row['tot_mv']:^10.0f}")
        
        print("-" * 80)
        print(f"\n✅ 选股完成，共选出 {len(df)} 只股票")
        
        # 导出Excel
        try:
            import openpyxl
            wb = openpyxl.Workbook()
            ws = wb.active
            ws.title = '股票池'
            ws.append(['排名', '代码', '名称', '收盘价', 'PE', 'ROE(%)', '动量(%)', '市值(亿)'])
            
            for i, (_, row) in enumerate(df.iterrows(), 1):
                ws.append([i, row['symbol'], row['name'], row['close'], row['pe_ttm'], row['roe']*100, row['momentum']*100, row['tot_mv']])
            
            filename = f'股票池_{now_str}.xlsx'
            wb.save(filename)
            print(f"\n📊 已导出到: {filename}")
        except:
            print("\n⚠️ Excel导出需要安装 openpyxl")
        
    except Exception as e:
        print(f"\n❌ 选股失败: {e}")


if __name__ == '__main__':
    select_stocks()