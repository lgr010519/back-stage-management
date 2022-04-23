<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: '',
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 最小值与最大值的设置
        min: 0,
        max: 100
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        // 均分
        type: 'category'
      },
      // 系列
      series: [{
        type: 'bar',
        data: [78],
        color: 'yellowgreen',
        // 柱状图的宽度
        barWidth: 10,
        // 背景颜色
        showBackground: true,
        backgroundStyle: {
          color: '#eee'
        },
        // 文本
        label: {
          show: true,
          formatter:'|',
          position:'right'
        }
      }],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
    })
  },
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
