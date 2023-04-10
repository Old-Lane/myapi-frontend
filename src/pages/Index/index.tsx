import {PageContainer} from '@ant-design/pro-components';
import {List, message, Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import {listInterfaceInfoByPageUsingPOST} from "@/services/myapi-backend/interfaceInfoController";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadDate = async (current = 1, pageSize = 6) => {
    setLoading(true)
    try {
      const res = await listInterfaceInfoByPageUsingPOST({
        current, pageSize
      })
      setList(res?.data?.records ?? [])
      setTotal(res?.data?.total ?? 0)
    } catch (error: any) {
      message.error(`加载失败, ${error.message}`);
    }
    setLoading(false)
  }

  useEffect(() => {
    loadDate()
  }, [])

  return (
    <PageContainer title={"API 接口开放平台"}>
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`
          return <List.Item
            actions={[<a key={item.id} href={apiLink}>查看</a>]}
          >
            <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                title={<a key={item.id} href={apiLink}>{item.name}</a>}
                description={item.description}
              />
              <div>{item.url}</div>
            </Skeleton>
          </List.Item>
        }}
        pagination={
          {
            showTotal(total: number) {
              return '总数：' + total
            },
            total: total,
            pageSize: 6,
            onChange(page, pageSize) {
              loadDate(page, pageSize)
            }
          }
        }
      />
    </PageContainer>
  );
};

export default Index;
