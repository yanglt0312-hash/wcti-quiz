from statsbombpy import sb
import pandas as pd
import os
import time

# --- 1. 配置区 ---
OUTPUT_DIR = "StatsBomb_Data"

# 48支球队的英文映射名单（包含部分别名以防止遗漏）
TARGET_TEAMS = [
    "Mexico", "South Korea", "South Africa", "Czech Republic", "Czechia", "Canada",
    "Switzerland", "Qatar", "Bosnia and Herzegovina", "Brazil", "Morocco",
    "Scotland", "Haiti", "United States", "Australia", "Paraguay",
    "Turkey", "Turkiye", "Germany", "Ecuador", "Ivory Coast", "Côte d'Ivoire",
    "Curaçao", "Curacao", "Netherlands", "Japan", "Tunisia",
    "Sweden", "Belgium", "Iran", "Egypt", "New Zealand",
    "Spain", "Uruguay", "Saudi Arabia", "Cape Verde", "France",
    "Senegal", "Norway", "Iraq", "Argentina", "Austria",
    "Algeria", "Jordan", "Portugal", "Colombia", "Uzbekistan",
    "Congo DR", "Democratic Republic of the Congo", "England", "Croatia",
    "Panama", "Ghana"
]

# 重点获取的顶级国家队赛事名称
TARGET_COMPETITIONS = [
    'FIFA World Cup',
    'UEFA Euro',
    'Copa America',
    'African Cup of Nations'
]


def main():
    print("正在连接 StatsBomb 全球开源数据库...")

    # 确保根目录存在
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 1. 获取所有公开赛事
    try:
        comps = sb.competitions()
    except Exception as e:
        print(f"获取赛事列表失败: {e}")
        return

    # 筛选出男子国家队顶级大赛
    intl_comps = comps[
        (comps['competition_name'].isin(TARGET_COMPETITIONS)) &
        (comps['competition_gender'] == 'male')
        ]

    print(f"\n锁定以下大赛的开源数据：")
    for _, row in intl_comps.iterrows():
        print(f" - {row['competition_name']} ({row['season_name']})")

    total_downloaded = 0

    # 2. 遍历每一个大赛
    for _, comp_row in intl_comps.iterrows():
        comp_id = comp_row['competition_id']
        season_id = comp_row['season_id']
        comp_name = comp_row['competition_name']
        season_name = comp_row['season_name']

        print(f"\n正在检索 [{comp_name} {season_name}] 的赛程...")
        try:
            matches = sb.matches(competition_id=comp_id, season_id=season_id)
        except Exception as e:
            print(f"无法获取 {comp_name} 赛程: {e}")
            continue

        # 3. 遍历大赛中的每一场比赛，进行名单过滤
        for _, match_row in matches.iterrows():
            match_id = match_row['match_id']
            home_team = match_row['home_team']
            away_team = match_row['away_team']

            # 检查交战双方是否有目标球队
            home_match = home_team in TARGET_TEAMS
            away_match = away_team in TARGET_TEAMS

            if not home_match and not away_match:
                continue

            match_title = f"{home_team}_vs_{away_team}_{season_name}.csv".replace(" ", "_")

            try:
                # 提取战术事件
                events = sb.events(match_id=match_id)

                # 4. 分发到国家文件夹
                if home_match:
                    team_dir = os.path.join(OUTPUT_DIR, home_team.replace(" ", "_"))
                    os.makedirs(team_dir, exist_ok=True)
                    events.to_csv(os.path.join(team_dir, match_title), index=False, encoding='utf-8-sig')
                    print(f"  [命中] {home_team} 比赛已入库: {match_title}")

                if away_match:
                    team_dir = os.path.join(OUTPUT_DIR, away_team.replace(" ", "_"))
                    os.makedirs(team_dir, exist_ok=True)
                    events.to_csv(os.path.join(team_dir, match_title), index=False, encoding='utf-8-sig')
                    print(f"  [命中] {away_team} 比赛已入库: {match_title}")

                total_downloaded += 1

            except Exception as e:
                print(f"  [下载失败] {match_title}: {e}")

            time.sleep(1)

    print("\n" + "=" * 40)
    print(f"处理完毕。共成功下载了 {total_downloaded} 场赛事数据。")
    print(f"数据存放目录: '{OUTPUT_DIR}'")
    print("=" * 40)


if __name__ == "__main__":
    main()