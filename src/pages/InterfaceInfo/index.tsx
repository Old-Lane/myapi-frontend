import {PageContainer} from '@ant-design/pro-components';
import {Button, Card, Descriptions, Divider, Form, Input, List, message, Skeleton, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
import {
  getInterfaceInfoByIdUsingGET, invokeInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingPOST
} from "@/services/myapi-backend/interfaceInfoController";
import {useParams} from "@@/exports";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>({});
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const params = useParams()

  const loadDate = async () => {
    setLoading(true)
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id)
      })
      setData(res?.data ?? {})
    } catch (error: any) {
      message.error(`加载失败, ${error.message}`);
    }
    setLoading(false)
  }

  useEffect(() => {
    loadDate()
  }, [])

  const onFinish = async (value: any) => {
    setInvokeLoading(true)
    try {
      const res = await invokeInterfaceInfoUsingPOST({
        id: Number(params.id),
        ...value
      })
      setInvokeRes(res?.data ?? {})
    } catch (error: any) {
      message.error(`调用失败, ${error.message}`);
    }
    setInvokeLoading(false)
  }

  return (
    <PageContainer title={"接口详情页"}>
      <Card title="接口信息">
        <Descriptions title={data.name}>
          <Descriptions.Item label="URL">{data.url}</Descriptions.Item>
          <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
          <Descriptions.Item label="状态">{data.status === 0 ? '禁用' : '正常'}</Descriptions.Item>
          <Descriptions.Item label="请求方式">{data.method}</Descriptions.Item>
          <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
          <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
          <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Divider />
      <Card title="在线测试">
        <Form
          name="invoke"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="请求参数"
            name="userRequestParams"
          >
            <Input.TextArea autoSize={{minRows: 6}}/>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="测试结果">
        <Spin spinning={invokeLoading}></Spin>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
