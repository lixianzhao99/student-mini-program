# coding=utf-8
"""
股票池选股器 V2.0 - 测试验证脚本
用于验证代码结构和配置是否正确
注意：完整功能测试需要在掘金环境中运行
"""

import json
import os
import sys

def test_config_file():
    """测试配置文件是否存在且格式正确"""
    print("=" * 60)
    print("测试1: 配置文件验证")
    print("=" * 60)
    
    config_file = 'stock_selector_v2_config.json'
    
    # 检查文件是否存在
    if not os.path.exists(config_file):
        print(f"❌ 配置文件不存在: {config_file}")
        return False
    
    print(f"✅ 配置文件存在: {config_file}")
    
    # 检查JSON格式是否正确
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            config = json.load(f)
        print("✅ JSON格式正确")
    except json.JSONDecodeError as e:
        print(f"❌ JSON格式错误: {e}")
        return False
    
    # 检查必要配置项
    required_keys = ['strategy', 'indices', 'factors', 'market_adjust', 'backtest']
    for key in required_keys:
        if key not in config:
            print(f"❌ 缺少配置项: {key}")
            return False
        print(f"✅ 配置项存在: {key}")
    
    # 检查因子权重总和
    factors = config['factors']
    total_weight = sum(factors.values())
    if abs(total_weight - 1.0) > 0.01:
        print(f"❌ 因子权重总和不为1: {total_weight}")
        return False
    print(f"✅ 因子权重总和正确: {total_weight}")
    
    # 检查策略参数
    strategy = config['strategy']
    if strategy['holding_num'] < 5 or strategy['holding_num'] > 50:
        print(f"⚠️ 持仓数量可能不合理: {strategy['holding_num']}")
    else:
        print(f"✅ 持仓数量合理: {strategy['holding_num']}")
    
    print()
    return True


def test_code_structure():
    """测试代码文件结构"""
    print("=" * 60)
    print("测试2: 代码结构验证")
    print("=" * 60)
    
    code_file = 'stock_selector_v2.py'
    
    # 检查文件是否存在
    if not os.path.exists(code_file):
        print(f"❌ 代码文件不存在: {code_file}")
        return False
    
    print(f"✅ 代码文件存在: {code_file}")
    
    # 检查代码基本结构
    with open(code_file, 'r', encoding='utf-8') as f:
        code = f.read()
    
    # 检查必要函数
    required_functions = [
        'class StockSelectorV2',
        'def __init__',
        'def load_config',
        'def judge_market_environment',
        'def select_best_sector',
        'def get_stock_data',
        'def factor_scoring',
        'def filter_stocks',
        'def select_stocks',
        'def generate_analysis_report',
        'def export_to_excel',
        'def adjust_weights_by_market'
    ]
    
    for func in required_functions:
        if func not in code:
            print(f"❌ 缺少函数/类: {func}")
            return False
        print(f"✅ 函数/类存在: {func}")
    
    # 检查掘金API导入
    if 'from gm.api import *' not in code:
        print("❌ 缺少掘金API导入")
        return False
    print("✅ 掘金API导入正确")
    
    print()
    return True


def test_factor_weights():
    """测试因子权重配置"""
    print("=" * 60)
    print("测试3: 因子权重验证")
    print("=" * 60)
    
    config_file = 'stock_selector_v2_config.json'
    with open(config_file, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    factors = config['factors']
    
    # 分类统计权重
    momentum_total = factors.get('momentum_short_weight', 0) + \
                     factors.get('momentum_mid_weight', 0) + \
                     factors.get('momentum_long_weight', 0) + \
                     factors.get('reversal_weight', 0)
    
    value_total = factors.get('valuation_pe_weight', 0) + \
                  factors.get('valuation_pb_weight', 0) + \
                  factors.get('valuation_ps_weight', 0) + \
                  factors.get('dividend_yield_weight', 0)
    
    quality_total = factors.get('quality_roe_weight', 0) + \
                    factors.get('growth_weight', 0)
    
    risk_total = factors.get('volatility_weight', 0) + \
                 factors.get('beta_weight', 0)
    
    tech_total = factors.get('volume_ratio_weight', 0) + \
                 factors.get('size_weight', 0)
    
    print(f"动量类因子权重: {momentum_total:.2%}")
    print(f"估值类因子权重: {value_total:.2%}")
    print(f"质量类因子权重: {quality_total:.2%}")
    print(f"风险类因子权重: {risk_total:.2%}")
    print(f"技术类因子权重: {tech_total:.2%}")
    
    # 检查权重分布是否合理
    if momentum_total > 0.5:
        print("⚠️ 动量权重过高，可能过于激进")
    elif momentum_total < 0.2:
        print("⚠️ 动量权重过低，可能错过趋势")
    else:
        print("✅ 动量权重合理")
    
    if value_total > 0.4:
        print("⚠️ 估值权重过高，可能过于保守")
    elif value_total < 0.15:
        print("⚠️ 估值权重过低，可能风险较大")
    else:
        print("✅ 估值权重合理")
    
    print()
    return True


def test_market_adjust():
    """测试市场环境调整配置"""
    print("=" * 60)
    print("测试4: 市场环境调整验证")
    print("=" * 60)
    
    config_file = 'stock_selector_v2_config.json'
    with open(config_file, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    market_adjust = config.get('market_adjust', {})
    
    environments = ['bull', 'bear', 'volatile', 'neutral']
    for env in environments:
        if env not in market_adjust:
            print(f"❌ 缺少市场环境配置: {env}")
            return False
        
        adjust = market_adjust[env]
        factors = ['momentum', 'value', 'quality', 'volatility']
        for factor in factors:
            if factor not in adjust:
                print(f"❌ 缺少调整因子: {env}.{factor}")
                return False
            
            value = adjust[factor]
            if value < 0.5 or value > 2.0:
                print(f"⚠️ 调整系数可能不合理: {env}.{factor}={value}")
            else:
                print(f"✅ 调整系数合理: {env}.{factor}={value}")
    
    print()
    return True


def test_gm_api_availability():
    """测试掘金API是否可用"""
    print("=" * 60)
    print("测试5: 掘金API可用性验证")
    print("=" * 60)
    
    try:
        import gm.api as gm
        print("✅ 掘金API导入成功")
        
        # 检查关键函数是否存在
        api_functions = ['history_n', 'stk_get_financial_report', 
                        'stk_get_index_constituents', 'get_symbols',
                        'stk_get_daily_mktvalue_pt']
        
        for func_name in api_functions:
            if not hasattr(gm, func_name):
                print(f"❌ API函数不存在: {func_name}")
                return False
            print(f"✅ API函数存在: {func_name}")
        
        print()
        print("⚠️ 注意: API可用不代表能直接运行")
        print("   需要在掘金终端或云端环境中执行")
        
    except ImportError as e:
        print(f"❌ 掘金API导入失败: {e}")
        print("   这说明你不在掘金环境中")
        print("   请在掘金终端或云端运行完整功能")
        return False
    
    print()
    return True


def run_all_tests():
    """运行所有测试"""
    print("\n" + "=" * 60)
    print("股票池选股器 V2.0 - 测试验证报告")
    print("=" * 60 + "\n")
    
    results = []
    
    # 测试1: 配置文件
    results.append(("配置文件验证", test_config_file()))
    
    # 测试2: 代码结构
    results.append(("代码结构验证", test_code_structure()))
    
    # 测试3: 因子权重
    results.append(("因子权重验证", test_factor_weights()))
    
    # 测试4: 市场环境调整
    results.append(("市场环境调整验证", test_market_adjust()))
    
    # 测试5: 掘金API
    results.append(("掘金API可用性", test_gm_api_availability()))
    
    # 总结
    print("=" * 60)
    print("测试结果汇总")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ 通过" if result else "❌ 失败"
        print(f"{name}: {status}")
    
    print()
    print(f"通过率: {passed}/{total} ({passed/total*100:.0f}%)")
    
    if passed == total:
        print("\n🎉 所有测试通过！代码结构正确。")
        print("\n下一步:")
        print("1. 在掘金终端中打开 stock_selector_v2.py")
        print("2. 配置你的token")
        print("3. 运行策略进行选股")
    else:
        print("\n⚠️ 部分测试失败，请检查上述问题。")
    
    print("=" * 60)
    
    return passed == total


if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)