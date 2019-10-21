<template>
    <div class="m-menu">
        <dl class="nav" @mouseleave="mouseleaveHandler">
            <dt>全部分类</dt>
            <dd
                v-for="(item, index) in menu"
                :key="index"
                @mouseenter="hoverItem(item)"
            >
                <i :class="item.type"></i>{{ item.name }}<span class="arrow"></span>
            </dd>
        </dl>
        <div class="detail"
            v-show="kind !== ''"
            @mouseenter="detailMouseenterHandler"
            @mouseleave="detailMouseleaveHandler"
        >
            <div
                v-for="(item, index) in currentDetail.children"
                :key="index"
            >
                <h4>{{ item.title }}</h4>
                <span
                    v-for="child in item.children"
                    :key="child.text"
                >
                    {{ child.text }}
                </span>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
    computed: {
        currentDetail(){
            return this.menu.filter(item => {
                return (item.type === this.kind)
            })[0] || {};
        }
    },
    data(){
        return {
            kind: '',
            menu: [{
                type: 'food',
                name: '美食',
                children: [{
                    title: "美食",
                    children: [{
                        text: '甜点',
                        url: ''
                    },{
                        text: '代金券',
                        url: ''
                    },{
                        text: '火锅',
                        url: ''
                    },{
                        text: '自助餐',
                        url: ''
                    },{
                        text: '小吃快餐',
                        url: ''
                    }]
                }]
            },{
                type: 'takeout',
                name: '外卖',
                children: [{
                    title: "外卖",
                    children: [{
                        text: '美团外卖',
                        url: ''
                    }]
                }]
            },{
                type: 'hotel',
                name: '酒店',
                children: [{
                    title: "酒店星级",
                    children: [{
                        text: '经济型',
                        url: ''
                    },{
                        text: '舒适性/三星',
                        url: ''
                    },{
                        text: '高档/四星',
                        url: ''
                    },{
                        text: '豪华/五星',
                        url: ''
                    }]
                }]
            }]
        }
    },
    methods: {
        hoverItem(item){
            this.kind = item.type;
        },
        mouseleaveHandler(){
            this.hoverItemTimer = setTimeout(() => {
                this.kind = '';
            }, 100)
        },
        detailMouseenterHandler(){
            clearTimeout(this.hoverItemTimer);
        },
        detailMouseleaveHandler(){
            this.kind = '';
        }
    }
}
</script>

<style lang="scss">

</style>