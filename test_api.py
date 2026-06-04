# coding=utf-8
"""
股票池选股器 - 简化测试版
用途：测试掘金API连接和Token配置
不依赖外部配置文件，完全独立运行
"""
from __future__ import print_function, absolute_import, unicode_literals
from gm.api import *
import datetime

def test_api_connection():
    """测试API连接"""
    print("=" * 60)
    print("测试掘金API连接")
    print("=" * 60)
    
    try:
        # 尝试获取沪深300最新数据
        print("\n1. 测试获取沪深300数据...")
        data = history_n(
            symbol='SHSE.000300',
            frequency='1d',
            count=5,
            fields='close,bob',
            fill_missing='Last',
            adjust=ADJUST_PREV,
            end_time=datetime.datetime.now().strftime('%Y-%m-%d'),
            df=True
        )
        
        if data is not None and len(data) > 0:
            print("✅ API连接成功！")
            print(f"   沪深300最新5日收盘价：")
            for _, row in data.iterrows():
                date = row['bob'].strftime('%Y-%m-%d')
                close = row['close']
                print(f"   {date}: {close:.2f}")
            return True
        else:
            print("❌ 获取数据失败：返回空数据")
            return False
            
    except Exception as e:
        print(f"❌ API调用失败：{e}")
        print("\n可能的原因：")
        print("1. Token未配置或无效")
        print("2. 网络连接问题")
        print("3. 掘金终端未登录")
        return False

def test_index_constituents():
    """测试获取指数成分股"""
    print("\n" + "=" * 60)
    print("测试获取指数成分股")
    print("=" * 60)
    
    try:
        print("\n2. 测试获取沪深300成分股...")
        constituents = stk_get_index_constituents(
            index='SHSE.000300',
            trade_date=datetime.datetime.now().strftime('%Y-%m-%d')
        )
        
        if constituents is not None and len(constituents) > 0:
            print("✅ 获取成分股成功！")
            print(f"   沪深300成分股数量：{len(constituents)}")
            print(f"   前5只成分股：")
            for i in range(min(5, len(constituents))):
                symbol = constituents['symbol'].iloc[i]
                print(f"   {i+1}. {symbol}")
            return True
        else:
            print("❌ 获取成分股失败：返回空数据")
            return False
            
    except Exception as e:
        print(f"❌ 获取成分股失败：{e}")
        return False

def test_financial_data():
    """测试获取财务数据"""
    print("\n" + "=" * 60)
    print("测试获取财务数据")
    print("=" * 60)
    
    try:
        print("\n3. 测试获取股票财务数据...")
        fin_data = stk_get_financial_report(
            symbol='SHSE.600519',
            fields='pe_ttm,pb,roe',
            report_type=REPORT_TYPE_QUARTER,
            end_time=datetime.datetime.now().strftime('%Y-%m-%d'),
            df=True
        )
        
        if fin_data is not None and len(fin_data) > 0:
            print("✅ 获取财务数据成功！")
            print(f"   贵州茅台 PE: {fin_data['pe_ttm'].iloc[0]:.2f}")
            print(f"   贵州茅台 PB: {fin_data['pb'].iloc[0]:.2f}")
            print(f"   贵州茅台 ROE: {fin_data['roe'].iloc[0]*100:.2f}%")
            return True
        else:
            print("❌ 获取财务数据失败：返回空数据")
            return False
            
    except Exception as e:
        print(f"❌ 获取财务数据失败：{e}")
        return False

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("掘金API测试工具")
    print("说明：此脚本用于测试API连接是否正常")
    print("=" * 60 + "\n")
    
    # 运行所有测试
    test1 = test_api_connection()
    test2 = test_index_constituents()
    test3 = test_financial_data()
    
    print("\n" + "=" * 60)
    print("测试结果汇总")
    print("=" * 60)
    print(f"API连接测试: {'✅ 通过' if test1 else '❌ 失败'}")
    print(f"成分股测试:   {'✅ 通过' if test2 else '❌ 失败'}")
    print(f"财务数据测试: {'✅ 通过' if test3 else '❌ 失败'}")
    
    if test1 and test2 and test3:
        print("\n🎉 所有测试通过！")
        print("您的掘金环境配置正确，可以运行选股器了。")
    else:
        print("\n⚠️ 部分测试失败")
        print("请检查：")
        print("1. 是否已在掘金终端中登录")
        print("2. 网络连接是否正常")
        print("3. 是否需要重新生成Token")
    print("=" * 60)