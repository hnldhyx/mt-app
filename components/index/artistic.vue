<template>
	<section class="m-istyle">
		<dl @mouseover="over">
			<dt>有格调</dt>
			<dd :class="{active:kind === 'all'}" keyword="景点" kind="all">全部</dd>
			<dd :class="{active:kind === 'part'}" keyword="美食" kind="part">约会</dd>
			<dd :class="{active:kind === 'spa'}" keyword="丽人" kind="spa">spa</dd>
			<dd :class="{active:kind === 'movie'}" keyword="电影" kind="movie">电影</dd>
			<dd :class="{active:kind==='travel'}" keyword="旅游" kind="travel">品质出游</dd>
		</dl>
		<ul class="ibody">
			<li v-for="item in cur" :key="item.title">
				<el-card :body-style="{ padding: '0px' }" shadow="never">
					<img :src="item.img" class="image" />
					<ul class="cbody">
						<li class="title">{{item.title}}</li>
						<li class="pos">{{item.detail}}</li>
						<li class="price">{{item.price}}</li>
					</ul>
				</el-card>
			</li>
		</ul>
	</section>
</template>
<script>
export default {
	data() {
	return {
		kind: "all",
		list: {
			all: []
		}
	};
	},
	computed: {
	cur: function() {
		return this.list[this.kind];
	}
	},
	methods: {
		over: function(e) {
			
		}
	},
	mounted() {
		
	}
};
</script>

<style lang="scss">
@import "@/assets/css/index/artistic.scss";
</style>