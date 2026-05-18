import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function TeamRadar() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const [teamData, setTeamData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  // 1. 数据加载引擎 (组件挂载时去 public 文件夹抓取 JSON)
  useEffect(() => {
    fetch('/Team_8D_Soul_Scores.json')
      .then(res => {
        if (!res.ok) throw new Error("JSON fetch failed");
        return res.json();
      })
      .then(data => {
        setTeamData(data);
        // 默认选中数据数组里的第一支球队
        if (data.length > 0) {
          setSelectedTeam(data[0].Team);
        }
      })
      .catch(err => console.error('数据加载异常，请检查 public 目录下是否有对应 JSON 文件:', err));
  }, []);

  // 2. ECharts 渲染与响应式监听
  useEffect(() => {
    if (!chartRef.current || !selectedTeam || teamData.length === 0) return;

    // 提取当前选中球队的数据
    const team = teamData.find(t => t.Team === selectedTeam);
    if (!team) return;

    // 单例模式：防止 ECharts 重复初始化
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 构建 8 维数据映射
    const dataValues = [
      team.Dim1_Heritage,
      team.Dim2_Domination,
      team.Dim3_Hero,
      team.Dim4_Pragmatic,
      team.Dim5_Control,
      team.Dim6_Resilience,
      team.Dim7_Physical,
      team.Dim8_Adaptive
    ];

    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        textStyle: { color: '#1f2937' }, // Tailwind gray-800
        padding: 12,
        borderRadius: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      },
      radar: {
        indicator: [
          { name: '豪门底蕴 (Heritage)', max: 100 },
          { name: '前场压制 (Domination)', max: 100 },
          { name: '英雄主义 (Heroism)', max: 100 },
          { name: '实用功利 (Pragmatic)', max: 100 },
          { name: '绝对控场 (Control)', max: 100 },
          { name: '逆境韧性 (Resilience)', max: 100 },
          { name: '身体对抗 (Physical)', max: 100 },
          { name: '战术多变 (Adaptive)', max: 100 }
        ],
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: '#4b5563', // Tailwind gray-600
          fontWeight: 'bold',
          fontSize: 13
        },
        splitArea: {
          areaStyle: {
            color: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af'],
            shadowColor: 'rgba(0, 0, 0, 0.05)',
            shadowBlur: 10
          }
        },
        axisLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.15)' } },
        splitLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.15)' } }
      },
      series: [{
        name: '战术 MBTI 画像',
        type: 'radar',
        data: [{
          value: dataValues,
          name: team.Team,
          symbolSize: 8,
          itemStyle: { color: '#3b82f6' }, // Tailwind blue-500
          areaStyle: {
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              { color: 'rgba(59, 130, 246, 0.1)', offset: 0 },
              { color: 'rgba(59, 130, 246, 0.6)', offset: 1 }
            ])
          },
          lineStyle: { width: 3 }
        }]
      }]
    };

    // 注入配置
    chartInstance.current.setOption(option);

    // 监听窗口缩放，自适应图表大小
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [selectedTeam, teamData]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      
      {/* 头部：标题与选择器 */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">全景战术灵魂剖析图</h2>
          <p className="text-sm text-gray-500 mt-1">Data driven by StatsBomb & FBref</p>
        </div>
        
        <select
          className="w-full sm:w-64 px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer font-medium"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          {teamData.length === 0 ? (
            <option value="">🔄 正在挂载数据中...</option>
          ) : (
            teamData.map(team => (
              <option key={team.Team} value={team.Team}>
                {team.Team}
              </option>
            ))
          )}
        </select>
      </div>
      
      {/* ECharts 挂载点：强制最小高度保证雷达图比例 */}
      <div 
        ref={chartRef} 
        className="w-full min-h-[500px] lg:min-h-[600px]"
      />
    </div>
  );
}