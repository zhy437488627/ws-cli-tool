function fanyi() {
    /* 待翻译文本 传入url */
    this.q = this.before.q;
    /* 从页面获取选择的目标语言 传入url */
    this.to = this.before.to;
    /* md5加密，生成签名 */
    this.sign = MD5(this.appid + this.q + this.salt + this.userkey);
    /* 对待翻译字符做url编码 */
    this.q = encodeURIComponent(this.before.q);
    /* 请求翻译 */
    this.axios
        .get(
            "/api/" +
            "?q=" +
            this.q +
            "&from=" +
            this.from +
            "&to=" +
            this.to +
            "&appid=" +
            this.appid +
            "&salt=" +
            this.salt +
            "&sign=" +
            this.sign
        )
        /* 得到返回数据 */
        .then(res => {
            this.fyjg = res.data.trans_result[0].dst; //得到翻译结果

            /* 把翻译结果分割成数组 */
            // var yiwenArr = new Array();
            // yiwenArr = this.fyjg.split("@");
        });
}
export {

}