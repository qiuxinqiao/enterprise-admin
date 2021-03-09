<template>
  <div class="scroll-container" ref="scrollContainer">
    <div :ref="refName" class="echars-line"></div>
  </div>
</template>

<script>
import initEcharts from "src/utils/initEchart";

export default {
  name: "scrollPane",
  data() {
    return {
      myChart: null
    };
  },
  props: ["refName"],
  mounted() {
    
  },
  methods: {
     drawEcharts(x , a , b) {
      initEcharts().then(echarts => {
      let name = this.refName;
      this.myChart = echarts.init(this.$refs[name]);
      this.myChart.setOption({
        title: {},
        tooltip: {
          trigger: "axis"
        },
        legend: {
            right:50,
            bottom: 0,
            itemHeight:6,
            itemWidth:10,
            data: ["入园", "离园"]
        },
        grid: {
          left: 50,
          right: 60,
          top: 45
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            name: "时间/h",
            data: x
          }
        ],
        color: ["rgba(196, 9, 12, 0.3)"],
        yAxis: [
          {
            name: "次数",
            minInterval: 1
          }
        ],
        series: [
          {
            smooth: true,
            name: "入园",
            type: "line",
            itemStyle: {
                normal: {
                    color: "#0e6ed9",
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }
            },
            data: a
          },
          {
            smooth: true,
            name: "离园",
            type: "line",
            itemStyle: {
                normal: {
                    color: "#e6af08",
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }
            },
            data:b
          }
        ]
      });
    });
     }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.echars-line {
  width: 100%;
  height: 300px;
  margin: 0;
  padding: 0;
}
</style>
