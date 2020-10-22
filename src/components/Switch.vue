<template>
  <div class="track switch" :class="{ 'is-occupied': junc.isOccupied }" @click="junc.switch()">
    <template v-if="junc.left && !junc.reverse && !junc.dirStraight">
      <svg width="20px" height="20px" viewBox="0 0 19.61 10.49">
        <path
            d="M-368.5-112.5"
            transform="translate(-1.45 -0.56)"
        />
        <path
            class="main"
            d="M1.5,6.59v.14a.14.14,0,0,1,.14-.14H11a.14.14,0,0,0,.09,0L17.48.65a.14.14,0,0,1,.19,0l3.24,3a.15.15,0,0,1,0,.21L18.16,6.37a.13.13,0,0,0,.09.24h2.62a.14.14,0,0,1,.14.14v4.11a.14.14,0,0,1-.14.14H1.64a.14.14,0,0,1-.14-.14V9.24"
            transform="translate(-1.45 -0.56)"
        />
        <path d="M1.5,9.24" transform="translate(-1.45 -0.56)"/>
        <line x1="16.71" y1="5.81" x2="11.55" y2="10.44"/>
      </svg>
    </template>
    <template v-if="junc.left && !junc.reverse && junc.dirStraight">
      <svg width="20px" height="20px" viewBox="0 0 19.61 10.49">
        <path d="M-368.5-112.5" transform="translate(-1.45 -0.56)"/>
        <path
            class="main"
            d="M1.5,6.59v.14a.14.14,0,0,1,.14-.14H11a.14.14,0,0,0,.09,0L17.48.65a.14.14,0,0,1,.19,0l3.24,3a.15.15,0,0,1,0,.21L18.16,6.37a.13.13,0,0,0,.09.24h2.62a.14.14,0,0,1,.14.14v4.11a.14.14,0,0,1-.14.14H1.64a.14.14,0,0,1-.14-.14V9.24"
            transform="translate(-1.45 -0.56)"/>
        <path d="M1.5,9.24" transform="translate(-1.45 -0.56)"/>
        <line x1="9.51" y1="6.03" x2="16.8" y2="6.05"/>
      </svg>
    </template>
    <template v-if="!junc.left && junc.reverse && !junc.dirStraight">
      <svg width="20px" height="20px" viewBox="0 0 19.61 10.49">
        <path d="M-368.5-112.5" transform="translate(-1.45 -0.56)"/>
        <path
            class="main"
            d="M21,6.59v.14a.14.14,0,0,0-.14-.14H11.55a.16.16,0,0,1-.09,0L5,.65a.13.13,0,0,0-.18,0l-3.25,3a.15.15,0,0,0,0,.21L4.36,6.37a.14.14,0,0,1-.1.24H1.64a.14.14,0,0,0-.14.14v4.11a.14.14,0,0,0,.14.14H20.87a.14.14,0,0,0,.14-.14V9.24"
            transform="translate(-1.45 -0.56)"/>
        <path d="M21,9.24" transform="translate(-1.45 -0.56)"/>
        <line x1="2.91" y1="5.81" x2="8.06" y2="10.44"/>
      </svg>
    </template>
    <template v-if="!junc.left && junc.reverse && junc.dirStraight">
      <svg width="20px" height="20px" viewBox="0 0 19.61 10.49">
        <path d="M-368.5-112.5" transform="translate(-1.45 -0.56)"/>
        <path
            class="main"
            d="M21,6.59v.14a.14.14,0,0,0-.14-.14H11.55a.16.16,0,0,1-.09,0L5,.65a.13.13,0,0,0-.18,0l-3.25,3a.15.15,0,0,0,0,.21L4.36,6.37a.14.14,0,0,1-.1.24H1.64a.14.14,0,0,0-.14.14v4.11a.14.14,0,0,0,.14.14H20.87a.14.14,0,0,0,.14-.14V9.24"
            transform="translate(-1.45 -0.56)"/>
        <path d="M21,9.24" transform="translate(-1.45 -0.56)"/>
        <line x1="2.81" y1="6.05" x2="10.1" y2="6.03"/>
      </svg>
    </template>
  </div>
</template>

<style lang="scss">
$basic-red: #e2002a;
$light-red: lighten($basic-red, 20%);
.track.switch {
  svg {
    padding-top: 3px;
    path,
    line {
      fill: #fff;
      stroke: #000;
      stroke-miterlimit: 10;
      stroke-width: 1px;
    }
  }

  &.is-occupied svg path.main {
    fill: $light-red;
  }
}
</style>

<script lang="ts">
import { Switch } from '@/railway'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() private junc!: Switch;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
