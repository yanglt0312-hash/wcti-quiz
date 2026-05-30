import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function TeamRadar() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const [teamData, setTeamData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    fetch('/Team_8D_Soul_Scores.json')
      .then(res => {
        if (!res.ok) throw new Error("JSON fetch failed");
        return res.json();
      })
      .then(data => {
        setTeamData(data);
        if (data.length > 0) {
          setSelectedTeam(data[0].Team);
        }
      })
      .catch(err => console.error('数据加载异常，请检查 public 目录下是否有对应 JSON 文件:', err));
  }, []);

  useEffect(() => {
    if (!chartRef.current || !selectedTeam || teamData.length === 0) return;

    const team = teamData.find(t => t.Team === selectedTeam);
    if (!team) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

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
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#18181b',
        borderColor: '#3f3f46',
        textStyle: { color: '#f4f4f5', fontFamily: 'monospace' },
        padding: 12
      },
      radar: {
        indicator: [
          { name: '豪门底蕴', max: 100 },
          { name: '前场压制', max: 100 },
          { name: '英雄主义', max: 100 },
          { name: '实用功利', max: 100 },
          { name: '绝对控场', max: 100 },
          { name: '逆境韧性', max: 100 },
          { name: '身体对抗', max: 100 },
          { name: '战术多变', max: 100 }
        ],
        shape: 'polygon',
        splitNumber: 5,
        center: ['50%', '50%'],
        radius: '65%',
        axisName: {
          color: '#71717a',
          fontWeight: 'bold',
          fontSize: 12,
          fontFamily: 'monospace'
        },
        splitArea: {
          areaStyle: {
            color: ['#09090b', '#18181b', '#09090b', '#18181b', '#09090b']
          }
        },
        axisLine: { lineStyle: { color: '#27272a' } },
        splitLine: { lineStyle: { color: '#27272a' } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: dataValues,
          name: team.Team,
          symbolSize: 6,
          itemStyle: { color: '#22c55e' },
          areaStyle: {
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              { color: 'rgba(34, 197, 94, 0.05)', offset: 0 },
              { color: 'rgba(34, 197, 94, 0.35)', offset: 1 }
            ])
          },
          lineStyle: { width: 2.5 }
        }]
      }]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [selectedTeam, teamData]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-zinc-900 border border-zinc-800">
      
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-100 tracking-tight">全景战术灵魂剖析图</h2>
          <p className="text-sm text-zinc-500 mt-1 font-mono tracking-widest">Data driven by StatsBomb & FBref</p>
        </div>
        
        <select
          className="w-full sm:w-64 px-4 py-2.5 bg-zinc-950 border border-zinc-700 text-zinc-300 focus:outline-none focus:border-green-500 transition-all cursor-pointer font-mono text-sm"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          {teamData.length === 0 ? (
            <option value="">数据加载中...</option>
          ) : (
            teamData.map(team => (
              <option key={team.Team} value={team.Team}>
                {team.Team}
              </option>
            ))
          )}
        </select>
      </div>
      
      <div 
        ref={chartRef} 
        className="w-full min-h-[500px] lg:min-h-[600px]"
      />
    </div>
  );
}