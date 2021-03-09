<!--
 * @Author: qiaozp
 * @Date: 2019-05-17 10:15:27
 * @LastEditors: qiaozp
 * @LastEditTime: 2019-05-21 14:59:14
 * @Description: 环形(中心无内容)
 -->

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
    initEcharts().then(echarts => {
      let name = this.refName;
      this.myChart = echarts.init(this.$refs[name]);
      this.myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
        //   orient: "vertical",
        //   x: "left",
          bottom: 5,
          itemHeight:6,
          itemWidth:10,
          data: ["非包干用户", "包干用户"]
        },
        color: ["#0e6de9", "#e6af08"],
        series: [
          {
            name: "用气量",
            type: "pie",
            radius: ["50%", "65%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 310, name: "包干用户" },
              { value: 505, name: "非包干用户" },
            ]
          }
        ]
      });
    });
  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.echars-line {
  width: 100%;
  height: 250px;
  top: -10px;
}
</style>
