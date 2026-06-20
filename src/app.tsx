import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useMeetingStore } from '@/store/useMeetingStore';
// 全局样式
import './app.scss';

function App(props) {
  const initFromStorage = useMeetingStore(state => state.initFromStorage);

  useEffect(() => {
    console.log('[App] 应用启动，初始化数据存储...');
    initFromStorage();
  }, [initFromStorage]);

  // 对应 onShow
  useDidShow(() => {
    console.log('[App] onShow - 刷新本地数据');
    initFromStorage();
  });

  // 对应 onHide
  useDidHide(() => {
    console.log('[App] onHide - 保存数据到本地');
    useMeetingStore.getState().saveToStorage();
  });

  return props.children;
}

export default App;
