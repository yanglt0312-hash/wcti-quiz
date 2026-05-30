import pandas as pd
import numpy as np

def run_simulation(csv_path, num_users=10000):
    print(f"🚀 正在加载球队数据并生成 {num_users} 名虚拟用户...\n")
    
    # 1. 读取球队数据
    try:
        df = pd.read_csv(csv_path)
    except FileNotFoundError:
        print(f"❌ 找不到文件: {csv_path}，请确保路径正确！")
        return
    
    # 假设你的 CSV 第一列是 'Team'，后面 8 列是维度分数 (Dim1_Heritage 等)
    teams = df['Team'].values
    
    # 提取球队的 8 维数据矩阵
    # 根据你前端的 JS，维度列应该是从第 2 列开始的 8 列
    team_vectors = df.iloc[:, 1:9].values 
    
    # 2. 生成虚拟用户得分矩阵
    # 真实用户的得分通常呈正态分布，平均分在 50 左右，这里设定标准差为 15
    user_vectors = np.random.normal(loc=50, scale=15, size=(num_users, 8))
    # 将超出的分数截断，限制在 0-100 之间
    user_vectors = np.clip(user_vectors, 0, 100)
    
    # 3. 批量计算余弦相似度 (矩阵运算，极速搞定)
    # 归一化用户向量
    user_norms = np.linalg.norm(user_vectors, axis=1, keepdims=True)
    user_normalized = user_vectors / (user_norms + 1e-10) # 加极小值防止除以 0
    
    # 归一化球队向量
    team_norms = np.linalg.norm(team_vectors, axis=1, keepdims=True)
    team_normalized = team_vectors / (team_norms + 1e-10)
    
    # 矩阵点乘得到相似度矩阵 (10000, 48)
    similarities = np.dot(user_normalized, team_normalized.T)
    
    # 4. 统计命中结果
    # 找到每个用户相似度最高的那支球队索引
    best_match_indices = np.argmax(similarities, axis=1)
    
    # 统计各球队被选中的次数
    unique, counts = np.unique(best_match_indices, return_counts=True)
    hit_counts = dict(zip(unique, counts))
    
    # 5. 生成诊断报告
    results = []
    for i, team in enumerate(teams):
        count = hit_counts.get(i, 0)
        rate = (count / num_users) * 100
        results.append((team, count, rate))
        
    # 按命中率从高到低排序
    results.sort(key=lambda x: x[2], reverse=True)
    
    print("=== 📊 球队命中率诊断报告 ===")
    print("理论完美平均命中率应为: {:.2f}%\n".format((1/len(teams))*100))
    
    print("🚨 【流量黑洞】(命中率过高，特征太平庸，截胡了其他球队):")
    for team, count, rate in results[:5]:
        print(f" - {team:<20} 命中: {count:<5} 次 ({rate:>5.2f}%)")
        
    print("\n--------------------------------------------------")
    print("👻 【隐形球队】(命中率极低，特征被其他相似球队完全覆盖):")
    # 找出命中率低于 0.5% 的球队
    invisible_teams = [r for r in results if r[2] < 0.5]
    if invisible_teams:
        # 按命中率从小到大排序展示倒数的球队
        for team, count, rate in sorted(invisible_teams, key=lambda x: x[2])[:10]:
            print(f" - {team:<20} 命中: {count:<5} 次 ({rate:>5.2f}%)")
    else:
        print(" 🎉 恭喜！没有绝对的隐形球队，大家都有出场机会！")
        for team, count, rate in results[-5:]:
            print(f" - {team:<20} 命中: {count:<5} 次 ({rate:>5.2f}%)")

if __name__ == "__main__":
    # 假设你的 csv 放在 frontend/public 目录下，请根据实际情况修改相对路径
    csv_file_path = "../frontend/public/Team_8D_Soul_Scores.csv"
    run_simulation(csv_file_path)