import os
import re
import pandas as pd
from bs4 import BeautifulSoup
from io import StringIO

# --- 配置区 ---
RAW_DIR = "raw_html"
CLEAN_DIR = "clean_data"


def clean_fbref_columns(df):
    """清洗 FBref 表格复杂的多级表头"""
    if isinstance(df.columns, pd.MultiIndex):
        new_cols = []
        for col in df.columns:
            cleaned_col_parts = [str(c) for c in col if "Unnamed" not in str(c) and str(c).strip() != ""]
            col_name = "_".join(cleaned_col_parts).strip("_")
            new_cols.append(col_name)
        df.columns = new_cols
    return df


def process_match_html(file_path, output_dir, file_name):
    """
    解析单场比赛，返回三种状态：
    'skipped' (已清洗过), 'success' (新清洗成功), 'deleted' (残次品，已销毁源文件)
    """
    out_path = os.path.join(output_dir, file_name.replace(".html", ".csv"))

    # 🌟 机制1：增量跳过。如果之前已经成功生成了 CSV，直接跳过，节省大量时间
    if os.path.exists(out_path):
        return 'skipped'

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except Exception as e:
        print(f"  🚨 [文件损坏，执行销毁] {file_name}: {e}")
        try:
            os.remove(file_path)
        except:
            pass
        return 'deleted'

    soup = BeautifulSoup(html_content, 'html.parser')
    tables = soup.find_all('table', id=re.compile(r"stats_.*_summary"))

    # 🌟 机制2：质检不合格（没找到数据表）。可能是遇到盾牌页、重定向页或 500 报错页。
    if not tables:
        print(f"  🗑️ [残次品，执行销毁] 缺失有效数据表: {file_name}")
        try:
            os.remove(file_path)  # 核心动作：从本地删除这个坏网页！
        except:
            pass
        return 'deleted'

    all_teams_df = []
    for table in tables:
        caption = table.find('caption')
        team_name = "Unknown_Team"
        if caption:
            team_name = caption.text.replace("Player Stats Table", "").replace("Player Stats", "").strip()

        try:
            html_io = StringIO(str(table))
            df = pd.read_html(html_io)[0]
            df = clean_fbref_columns(df)
            df.insert(0, 'Team', team_name)
            all_teams_df.append(df)
        except Exception as e:
            continue

    if all_teams_df:
        final_df = pd.concat(all_teams_df, ignore_index=True)
        final_df = final_df.dropna(axis=1, how='all')

        os.makedirs(output_dir, exist_ok=True)
        final_df.to_csv(out_path, index=False, encoding='utf-8-sig')
        return 'success'

    # 🌟 机制3：解析虽然没报错，但提取不出任何数据，依然按残次品处理
    print(f"  🗑️ [解析空值，执行销毁] 无法提取行列: {file_name}")
    try:
        os.remove(file_path)
    except:
        pass
    return 'deleted'


def main():
    if not os.path.exists(RAW_DIR):
        print(f"错误：未找到 {RAW_DIR} 文件夹。")
        return

    if not os.path.exists(CLEAN_DIR):
        os.makedirs(CLEAN_DIR)

    teams = [d for d in os.listdir(RAW_DIR) if os.path.isdir(os.path.join(RAW_DIR, d))]

    total_success = 0
    total_deleted = 0
    total_skipped = 0

    for team_folder in teams:
        team_path = os.path.join(RAW_DIR, team_folder)
        output_team_dir = os.path.join(CLEAN_DIR, team_folder)

        files = [f for f in os.listdir(team_path) if f.endswith(".html")]
        if not files:
            continue

        print(f"\n🔬 正在质检与清洗: {team_folder} ...")

        team_success = 0
        team_deleted = 0

        for file_name in files:
            file_path = os.path.join(team_path, file_name)
            status = process_match_html(file_path, output_team_dir, file_name)

            if status == 'success':
                team_success += 1
                total_success += 1
            elif status == 'deleted':
                team_deleted += 1
                total_deleted += 1
            elif status == 'skipped':
                total_skipped += 1

        if team_success > 0 or team_deleted > 0:
            print(f"  -> 新增清洗: {team_success} 场 | 销毁残次品: {team_deleted} 场")

    print("\n" + "=" * 40)
    print("🎉 质检与清洗全流程完毕！")
    print(f"✅ 历史累计安全跳过: {total_skipped} 场")
    print(f"🆕 本次新增完美清洗: {total_success} 场")
    if total_deleted > 0:
        print(f"🔥 本次毫不留情销毁: {total_deleted} 场残次网页")
        print("\n👉 下一步指示：请立刻去运行一次 step1 爬虫！爬虫会自动补抓这缺失的场次。")
    else:
        print("\n🏆 完美！没有发现任何残次网页，你的数据池已达 100% 纯净状态！")
    print("=" * 40)


if __name__ == "__main__":
    main()