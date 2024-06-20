<template>
  <div ref="DrbCharts" style="width: 140px; height: 140px" />
</template>

<script>
import { echarts } from '@/components/echarts'
export default {
  props: {
    proportion: {
      type: String,
    },
  },
  watch: {
    proportion(newValue, oldValue) {
      if (oldValue) {
        this.newEcharts()
      }
    },
  },
  data() {
    return {
      myChart: null,
    }
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.DrbCharts)
    this.newEcharts()
  },
  methods: {
    newEcharts() {
      let option = {
        title: {
          text: this.proportion + '%',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            color: '#fff',
            fontSize: '30',
          },
        },
        color: ['#474B7B'],
        series: [
          {
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: ['60%', '90%'],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            data: [
              {
                value: Number(this.proportion),
                name: '01',
                itemStyle: {
                  normal: {
                    color: '#745CD4',
                    label: {
                      show: false,
                    },
                    labelLine: {
                      show: false,
                    },
                  },
                },
              },
              {
                name: '02',
                value: 100 - Number(this.proportion),
              },
            ],
          },
        ],
      }

      this.myChart.setOption(option)
    },
  },
  destroyed() {
    if (this.myChart) {
      this.myChart.dispose()
    }
    this.myChart = null
  },
}
</script>

<style scoped lang="scss"></style>
