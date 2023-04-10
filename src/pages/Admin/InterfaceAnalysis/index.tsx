import React, {useEffect, useState} from 'react';
import {PageContainer,} from '@ant-design/pro-components';
import '@umijs/max';
import ReactECharts from 'echarts-for-react';
import {listTopInvokeInterfaceInfoUsingGET} from "@/services/myapi-backend/analysisController";
import {message} from "antd";

const InterfaceAnalysis: React.FC = () => {

  const [data, setData] = useState<API.InterfaceInfoVO[]>([])
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    try {
      const res = await listTopInvokeInterfaceInfoUsingGET();
      if (res.data) {
        setData(res.data)
      }
    } catch (error: any) {
      message.error(`加载失败, ${error.message}`);
    }
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const filterData = data.map(item => {
    return {
      value: item.totalNum,
      name: item.name
    }
  })

  const option = {
    title: {
      text: '接口调用次数Top 3',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '调用次数',
        type: 'pie',
        radius: '50%',
        data: filterData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

// render echarts option.
  return (
    <PageContainer>
      <ReactECharts showLoading={loading} option={option}/>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
