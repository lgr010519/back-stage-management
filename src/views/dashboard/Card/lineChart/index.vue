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
        type: 'category'
      },
      yAxis: {
        // 隐藏y轴
        show: false
      },
      // 系列
      series: [{
        type: 'line',
        data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
        smooth: true,
        // 拐点样式设置
        itemStyle: {
          opacity: 0,
        },
        // 线条样式
        lineStyle: {
          color: 'purple',
        },
        // 填充颜色设置
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: 'purple'
              },
              {
                offset: 1,
                color: 'white'
              }
            ],
            global: false
          }
        }
      }],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
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
