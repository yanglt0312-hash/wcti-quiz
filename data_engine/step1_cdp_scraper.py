import os
import time
import random
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

# --- 1. 配置区 ---
RAW_DIR = "raw_html"
if not os.path.exists(RAW_DIR):
    os.makedirs(RAW_DIR)

# 我们要爬取的年份列表
TARGET_YEARS = ["2024", "2025", "2026"]

# 猎物名单 (URL 模板化) - 共 48 支球队
TARGET_TEAMS = {
    # 北美及加勒比海区 (CONCACAF)

     "Mexico": "https://fbref.com/en/squads/b009a548/{YEAR}/matchlogs/all_comps/Mexico-Men-Match-Logs-All-Competitions",
    # "Canada": "https://fbref.com/en/squads/9c6d90a0/{YEAR}/matchlogs/all_comps/Canada-Men-Match-Logs-All-Competitions",
     "United_States": "https://fbref.com/en/squads/0f66725b/{YEAR}/matchlogs/all_comps/United-States-Men-Match-Logs-All-Competitions",
    # "Haiti": "https://fbref.com/en/squads/61828292/{YEAR}/matchlogs/all_comps/Haiti-Men-Match-Logs-All-Competitions",
    # "Curacao": "https://fbref.com/en/squads/e0f5893a/{YEAR}/matchlogs/all_comps/Curacao-Men-Match-Logs-All-Competitions",
    # "Panama": "https://fbref.com/en/squads/6061a82d/{YEAR}/matchlogs/all_comps/Panama-Men-Match-Logs-All-Competitions",
    #
    # # 亚洲区 (AFC)
    # "Korea_Republic": "https://fbref.com/en/squads/473f0fbf/{YEAR}/matchlogs/all_comps/Korea-Republic-Men-Match-Logs-All-Competitions",
    # "Qatar": "https://fbref.com/en/squads/9b696ed1/{YEAR}/matchlogs/all_comps/Qatar-Men-Match-Logs-All-Competitions",
    # "Australia": "https://fbref.com/en/squads/b90bf4f9/{YEAR}/matchlogs/all_comps/Australia-Men-Match-Logs-All-Competitions",
     "Japan": "https://fbref.com/en/squads/ffcf1690/{YEAR}/matchlogs/all_comps/Japan-Men-Match-Logs-All-Competitions",
    # "Iran": "https://fbref.com/en/squads/6a08f71e/{YEAR}/matchlogs/all_comps/IR-Iran-Men-Match-Logs-All-Competitions",
     "Saudi_Arabia": "https://fbref.com/en/squads/6e84edac/{YEAR}/matchlogs/all_comps/Saudi-Arabia-Men-Match-Logs-All-Competitions",
    # "Iraq": "https://fbref.com/en/squads/ec843efd/{YEAR}/matchlogs/all_comps/Iraq-Men-Match-Logs-All-Competitions",
    # "Jordan": "https://fbref.com/en/squads/3e22f0fa/{YEAR}/matchlogs/all_comps/Jordan-Men-Match-Logs-All-Competitions",
    # "Uzbekistan": "https://fbref.com/en/squads/cd389e75/{YEAR}/matchlogs/all_comps/Uzbekistan-Men-Match-Logs-All-Competitions",
    #
    # # 非洲区 (CAF)
    # "South_Africa": "https://fbref.com/en/squads/506f1741/{YEAR}/matchlogs/all_comps/South-Africa-Men-Match-Logs-All-Competitions",
     "Morocco": "https://fbref.com/en/squads/af41ccda/{YEAR}/matchlogs/all_comps/Morocco-Men-Match-Logs-All-Competitions",
    # "Cote_dIvoire": "https://fbref.com/en/squads/24772b12/{YEAR}/matchlogs/all_comps/Cote-dIvoire-Men-Match-Logs-All-Competitions",
    # "Tunisia": "https://fbref.com/en/squads/a7c7562a/{YEAR}/matchlogs/all_comps/Tunisia-Men-Match-Logs-All-Competitions",
    # "Egypt": "https://fbref.com/en/squads/b8889750/{YEAR}/matchlogs/all_comps/Egypt-Men-Match-Logs-All-Competitions",
    # "Cape_Verde": "https://fbref.com/en/squads/31fa6fa6/{YEAR}/matchlogs/all_comps/Cape-Verde-Men-Match-Logs-All-Competitions",
    # "Senegal": "https://fbref.com/en/squads/9ab5c684/{YEAR}/matchlogs/all_comps/Senegal-Men-Match-Logs-All-Competitions",
    "Algeria": "https://fbref.com/en/squads/1e2dba57/{YEAR}/matchlogs/all_comps/Algeria-Men-Match-Logs-All-Competitions",
    # "Congo_DR": "https://fbref.com/en/squads/9be9f315/{YEAR}/matchlogs/all_comps/Congo-DR-Men-Match-Logs-All-Competitions",
    # "Ghana": "https://fbref.com/en/squads/9349828d/{YEAR}/matchlogs/all_comps/Ghana-Men-Match-Logs-All-Competitions",
    #
    # # # 欧洲区 (UEFA)
    # "Czechia": "https://fbref.com/en/squads/2740937c/{YEAR}/matchlogs/all_comps/Czechia-Men-Match-Logs-All-Competitions",
    # "Switzerland": "https://fbref.com/en/squads/81021a70/{YEAR}/matchlogs/all_comps/Switzerland-Men-Match-Logs-All-Competitions",
    # "Bosnia_and_Herzegovina": "https://fbref.com/en/squads/6c5ef1c3/{YEAR}/matchlogs/all_comps/Bosnia-and-Herzegovina-Men-Match-Logs-All-Competitions",
    # "Scotland": "https://fbref.com/en/squads/602d3994/{YEAR}/matchlogs/all_comps/Scotland-Men-Match-Logs-All-Competitions",
    # "Turkey": "https://fbref.com/en/squads/ac6bcf92/{YEAR}/matchlogs/all_comps/Turkiye-Men-Match-Logs-All-Competitions",
     "Germany": "https://fbref.com/en/squads/c1e40422/{YEAR}/matchlogs/all_comps/Germany-Men-Match-Logs-All-Competitions",
    # "Netherlands": "https://fbref.com/en/squads/5bb5024a/{YEAR}/matchlogs/all_comps/Netherlands-Men-Match-Logs-All-Competitions",
    # "Sweden": "https://fbref.com/en/squads/296f69e7/{YEAR}/matchlogs/all_comps/Sweden-Men-Match-Logs-All-Competitions",
     "Belgium": "https://fbref.com/en/squads/361422b9/{YEAR}/matchlogs/all_comps/Belgium-Men-Match-Logs-All-Competitions",
    # "Spain": "https://fbref.com/en/squads/b561dd30/{YEAR}/matchlogs/all_comps/Spain-Men-Match-Logs-All-Competitions",
    # "France": "https://fbref.com/en/squads/b1b36dcd/{YEAR}/matchlogs/all_comps/France-Men-Match-Logs-All-Competitions",
    # "Norway": "https://fbref.com/en/squads/599eba19/{YEAR}/matchlogs/all_comps/Norway-Men-Match-Logs-All-Competitions",
     "Austria": "https://fbref.com/en/squads/d5121f10/{YEAR}/matchlogs/all_comps/Austria-Men-Match-Logs-All-Competitions",
    # "Portugal": "https://fbref.com/en/squads/4a1b4ea8/{YEAR}/matchlogs/all_comps/Portugal-Men-Match-Logs-All-Competitions",
    # "England": "https://fbref.com/en/squads/1862c019/{YEAR}/matchlogs/all_comps/England-Men-Match-Logs-All-Competitions",
    # "Croatia": "https://fbref.com/en/squads/7b08e376/{YEAR}/matchlogs/all_comps/Croatia-Men-Match-Logs-All-Competitions",
    #
    # # 南美区 (CONMEBOL)
     "Brazil": "https://fbref.com/en/squads/304635c3/{YEAR}/matchlogs/all_comps/Brazil-Men-Match-Logs-All-Competitions",
    # "Paraguay": "https://fbref.com/en/squads/d2043442/{YEAR}/matchlogs/all_comps/Paraguay-Men-Match-Logs-All-Competitions",
    # "Ecuador": "https://fbref.com/en/squads/123acaf8/{YEAR}/matchlogs/all_comps/Ecuador-Men-Match-Logs-All-Competitions",
     "Uruguay": "https://fbref.com/en/squads/870e020f/{YEAR}/matchlogs/all_comps/Uruguay-Men-Match-Logs-All-Competitions",
    # "Argentina": "https://fbref.com/en/squads/f9fddd6e/{YEAR}/matchlogs/all_comps/Argentina-Men-Match-Logs-All-Competitions",
    # "Colombia": "https://fbref.com/en/squads/ab73cfe5/{YEAR}/matchlogs/all_comps/Colombia-Men-Match-Logs-All-Competitions",
    #
    # # 大洋洲区 (OFC)
    # "New_Zealand": "https://fbref.com/en/squads/259855f0/{YEAR}/matchlogs/all_comps/New-Zealand-Men-Match-Logs-All-Competitions"
}


# --- 2. 核心辅助函数 ---

def smart_pass_cloudflare(driver):
    """智能防盾监控器：死盯页面，直到盾牌彻底消失"""
    # 刚跳转页面，先给浏览器 2 秒钟反应时间
    time.sleep(2)

    is_blocked = False
    while True:
        html = driver.page_source
        title = driver.title

        # 综合判断是否被拦截 (检查标题和源码里的 Cloudflare 专属特征)
        if "Just a moment" in title or "Cloudflare" in title or "cf-turnstile" in html or "cf-spinner" in html:
            is_blocked = True
            print("🛡️ 发现 Cloudflare 盾牌拦截！(圈圈正在转...)")
            print("⏳ 脚本已自动挂起，死盯盾牌中... (若长时间卡住，请人工在浏览器点一下)")
            time.sleep(3)  # 每 3 秒钟睁眼看一次盾牌还在不在
        else:
            # 盾牌特征消失，跳出死循环
            if is_blocked:
                print("✅ 盾牌已破！等待真实网页渲染...")
            break

    # 🚨 极其关键：盾牌刚消失时，真实网页其实还是白屏，必须强行等 4 秒让表格长出来！
    time.sleep(4)

def scroll_to_bottom_slowly(driver):
    """模拟真人缓慢向下滚动，触发高级数据表（如果有的话）"""
    total_height = int(driver.execute_script("return document.body.scrollHeight"))
    viewport_height = int(driver.execute_script("return window.innerHeight"))
    current_position = 0
    step = viewport_height // 2

    while current_position < total_height:
        current_position += step
        driver.execute_script(f"window.scrollTo(0, {current_position});")
        time.sleep(random.uniform(0.3, 0.6))

        new_total_height = int(driver.execute_script("return document.body.scrollHeight"))
        if new_total_height > total_height:
            total_height = new_total_height

    driver.execute_script("window.scrollTo(0, 0);")
    time.sleep(1)


# --- 3. 主程序逻辑 ---

def main():
    print("🔌 正在连接本地 9222 端口的 Chrome...")
    chrome_options = Options()
    chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")

    try:
        service = Service(executable_path="./chromedriver.exe")
        driver = webdriver.Chrome(service=service, options=chrome_options)
        print("✅ 成功接管 Chrome！开启全自动模式...\n")
    except Exception as e:
        print(f"❌ 接管失败，请确保 Chrome 已开启 9222 端口。报错: {e}")
        return

    # 第一层循环：遍历所有球队
    for team_name, template_url in TARGET_TEAMS.items():
        print(f"{"=" * 40}")
        print(f"🏆 开始处理球队: {team_name}")

        team_dir = os.path.join(RAW_DIR, team_name)
        if not os.path.exists(team_dir):
            os.makedirs(team_dir)

        # 第二层循环：遍历该球队的各个年份
        for year in TARGET_YEARS:
            log_url = template_url.replace("{YEAR}", year)
            print(f"\n📅 正在获取 {team_name} [{year} 年] 的赛程主页...")

            try:
                # 让浏览器自动跳转到该年的赛程页
                driver.get(log_url)
                smart_pass_cloudflare(driver)

                # 随机休息，防止翻页太快被封
                time.sleep(random.uniform(3.0, 5.0))

                # 读取赛程页，寻找比赛报告链接
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                report_links = soup.find_all('a', string="Match Report")

                if len(report_links) == 0:
                    print(f"⚠️ {year} 年没有找到任何比赛，可能赛程还没更新或页面不对。")
                    continue

                print(f"🎯 找到了 {len(report_links)} 场比赛，准备进入下载队列...")
                urls_to_scrape = ["https://fbref.com" + link['href'] for link in report_links]

                # 第三层循环：挨个访问比赛详情页并下载
                for match_url in urls_to_scrape:
                    match_name = match_url.split('/')[-1]
                    file_path = os.path.join(team_dir, f"{match_name}.html")

                    if os.path.exists(file_path):
                        print(f"⏩ [已存在，跳过] {match_name}")
                        continue

                    print(f"🚗 驶向赛场: {match_name}")
                    driver.get(match_url)
                    smart_pass_cloudflare(driver)

                    # 滚动并保存
                    scroll_to_bottom_slowly(driver)
                    match_html = driver.page_source

                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(match_html)
                    print(f"💾 [保存成功] {match_name}")

                    # 极其重要的休眠时间（千万别改小）
                    wait_time = random.uniform(4.5, 7.0)
                    print(f"⏳ 喝口水，休眠 {wait_time:.1f} 秒...\n")
                    time.sleep(wait_time)

            except Exception as e:
                print(f"❌ 处理 {team_name} {year} 年数据时发生异常: {e}")
                time.sleep(5)

    print("\n🎉🎉 全剧终！所有球队数据已全部安稳落盘！")


if __name__ == "__main__":
    main()