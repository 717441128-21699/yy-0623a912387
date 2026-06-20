export default defineAppConfig({
  pages: [
    'pages/meetings/index',
    'pages/pre-review/index',
    'pages/minutes/index',
    'pages/meeting-create/index',
    'pages/meeting-detail/index',
    'pages/review-detail/index',
    'pages/minute-detail/index',
    'pages/rectification/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165DFF',
    navigationBarTitleText: '危大工程专家论证',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#165DFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/meetings/index',
        text: '会议列表'
      },
      {
        pagePath: 'pages/pre-review/index',
        text: '材料预审'
      },
      {
        pagePath: 'pages/minutes/index',
        text: '纪要整改'
      }
    ]
  }
})
