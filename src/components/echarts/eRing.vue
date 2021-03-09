<!--
 * @Author: qiaozp
 * @Date: 2019-05-10 16:41:50
 * @LastEditors: qiaozp
 * @LastEditTime: 2019-05-17 11:34:28
 * @Description: 环形（中心有内容）
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
    
  },
  methods: {
    drawEcharts(a,b) {
      initEcharts().then(echarts => {
      let name = this.refName;
      this.myChart = echarts.init(this.$refs[name]);
      this.myChart.setOption({
        tooltip: {
            trigger: "item",
            extraCssText:'height:60px;',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        title: {
          text: "",
          x: "33%",
          y: 8,
          textStyle: {
            color: "#000",
            fontWeight: "lighter",
            fontSize: 16
          }
        },
        legend: {
          right:0,
          bottom: 0,
          itemHeight:6,
          itemWidth:10,
          data: [ "低于37.3","高于37.3"]
        },
        color: [  "#0e6de9","#e90e0e"],
        series: [ 
          {
            name: "员工体温",
            type: "pie",
            center: ["50%", "45%"],
            radius: ["45%", "60%"],
            label: {
              normal: {
                formatter: "{b|{b}：}{c} \n{per|（{d}%）}  ",
                show: false,
                rich: {
                  a: {
                    color: "#999",
                    align: "center"
                  },
                  hr: {
                    borderColor: "#aaa",
                    width: "100%",
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 25
                  },
                  per: {
                    color: "#000",
                    padding: [0, 0],
                    borderRadius: 2
                  }
                }
              }
            },
            itemStyle: {
              normal: {
                labelLine: {
                  //指示线状态
                  show: false,
                  smooth: 0.1,
                  length: 10,
                  length2: 10
                }
              }
            },
            data: [
              { value: a, name: "低于37.3" },
              { value: b, name: "高于37.3", selected: true }
            ]
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
  height: 260px;

}
</style>
