/*
 * @Author: qiaozp 
 * @Date: 2021-03-30 16:43:53
 * @Description: 图片裁剪组件 
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-30 17:07:59
 */
<template>
  <div class="wrapper">
    <div class="model" v-show="model" @click="model = false">
        <div class="model-show">
            <img :src="modelSrc" alt="">
        </div>
    </div>
    <div class="content">
        <div class="show-info">
            <div class="test">
                <vueCropper ref="cropper2" :img="url" :outputSize="example2.size" :outputType="example2.outputType"
                    :info="example2.info" :canScale="example2.canScale" :autoCrop="example2.autoCrop"
                    :autoCropWidth="example2.autoCropWidth" :autoCropHeight="example2.autoCropHeight" :fixed="example2.fixed"
                    :fixedNumber="example2.fixedNumber" :enlarge="4">
                </vueCropper>
            </div>
            <input type="file" id="upload2" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event,2)">
            <button @click="finish()" class="btn">裁剪</button>
        </div>
    </div>
 
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
    components: {
        VueCropper,
    },
    props:["url"],
    data() {
        return {
            model: false,
            modelSrc: '',
            crap: false,
            previews: {},
            form: {
                head: ''
            },
            example2: {
                //img的路径自行修改
                img: '$oss.url + \'/\' + form.head ', //裁剪图片的地址
                info: true, //裁剪框的大小信息
                size: 1,
                outputType: 'jpeg', //裁剪生成图片的格式
                canScale: true, //图片是否允许滚轮缩放
                autoCrop: true, //是否默认生成截图框
                // 只有自动截图开启 宽度高度才生效
                autoCropWidth: 470, //默认生成截图框宽度
                autoCropHeight: 200, //默认生成截图框高度
                fixed: false, //是否开启截图框宽高固定比例
                // 真实的输出宽高
                infoTrue: true, //true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                fixedNumber: [3, 2] //截图框的宽高比例
            },
            downImg: '#',
        }
    },
   
    mounted() {
        
    },
    methods: {
        //点击裁剪，这一步是可以拿到处理后的地址
        finish() {
            this.$refs.cropper2.getCropData((data) => {
                this.modelSrc = data
                this.model = false;
                //裁剪后的图片显示
                this.example2.img = this.modelSrc;
                let file = this.blobToFile(this.toBlob(data), 'name'); //base64转file
                let formData = new FormData()
                let config = {
					headers :{"Content-Type": "multipart/form-data"}
                }
                formData.append("file", file,Date.parse(new  Date()) +".jpeg");
				// this.$instance.post("/proxy/file/upload", formData, config).then(res =>{
				// 	if(res.status == 200){
                //         this.$emit("finishCropper",res.data)
				// 	}else{
				// 		Message.error({message:"调用接口失败"});
				// 	}
				// }).catch(error => { 

				// });
            })
        },

        uploadImg(e, num) {
            //上传图片
            this.example2.img = ''
            var file = e.target.files[0]
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                Message.error({message:'图片类型必须是.gif,jpeg,jpg,png,bmp中的一种'});
                return false
            }
            var reader = new FileReader()
            reader.onload = (e) => {
                let data
                data = e.target.result
                if (typeof e.target.result === 'object') {
                    // 把Array Buffer转化为blob 如果是base64不需要
                    data = window.URL.createObjectURL(new Blob([e.target.result]))
                } else {
                    data = e.target.result
                }
                if (num === 1) {
                    this.option.img = data
                } else if (num === 2) {
                    this.example2.img = data
                }
            }
            // 转化为base64
            // reader.readAsDataURL(file)
            // 转化为blobcs
            reader.readAsArrayBuffer(file)
        },

        // base64转blob
        toBlob(ndata) {
            //ndata为base64格式地址
            // console.log(ndata)
            let arr = ndata.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: mime
            })
        },

        //blob转file 兼容IE
        blobToFile(theBlob, fileName){
            theBlob.lastModifiedDate = new Date();
            theBlob.name = fileName;
            return theBlob;
        },

        //base64转file文件
        dataURLtoFile(dataurl, filename) {//将base64转换为文件
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        }
    },
}
</script>
<style rel="stylesheet/scss" scoped lang="scss">
    .content {
        margin: 20px;
        max-width: 700px;
    }
 
    .test-button {
        display: flex;
        flex-wrap: wrap;
    }
 
    .btn {
        width: 100px !important;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c0ccda;
        color: #1f2d3d;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 20px 10px 0px 0px;
        padding: 9px 15px;
        font-size: 14px;
        border-radius: 4px;
        color: #fff;
        background-color: #50bfff;
        border-color: #50bfff;
        transition: all .2s ease;
        text-decoration: none;
        user-select: none;
    }
 
    .test {
        width: 600px;
        height: 300px;
    }
 
    .model {
        position: fixed;
        z-index: 10;
        width: 100vw;
        height: 100vh;
        overflow: auto;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.8);
    }
 
    .model-show {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
    }
 
    .model img {
        display: block;
        margin: auto;
        max-width: 80%;
        user-select: none;
        background-position: 0px 0px, 10px 10px;
        background-size: 20px 20px;
        background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
    }
 
    .c-item {
        display: block;
        padding: 10px 0;
        user-select: none;
    }
</style>


