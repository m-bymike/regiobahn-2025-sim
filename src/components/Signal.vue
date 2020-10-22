<template>
  <div class="track signal" :class="{ 'is-occupied': sig.isOccupied }" @click="sig.change()">
    <template v-if="sig.reverse">
      <svg width="22px"
           height="13px" viewBox="-0.5 -0.5 22 13">
        <defs/>
        <g>
          <rect x="0" y="7" width="20" height="5" rx="0.75" ry="0.75"
                class="main"
                transform="rotate(-180,10,9.5)" pointer-events="all"/>
          <path d="M 20 3 L 0 3" stroke-miterlimit="10" pointer-events="stroke"/>
          <ellipse cx="2.5" cy="2.5" rx="2.5" ry="2.5" transform="rotate(-180,2.5,2.5)"
                   class="red-light"
                   :class="{ active: sig.stop }"
                   pointer-events="all"/>
          <ellipse cx="10.5" cy="2.5" rx="2.5" ry="2.5"
                   class="green-light"
                   :class="{ active: !sig.stop }"
                   transform="rotate(-180,10.5,2.5)"
                   pointer-events="all"/>
        </g>
      </svg>
    </template>
    <template v-else>
      <svg width="22px" height="13px" viewBox="-0.5 -0.5 22 13" class="signal">
        <g>
          <rect
              x="0"
              y="0"
              width="20"
              height="5"
              rx="0.75"
              ry="0.75"
              class="main"
              pointer-events="all"
          />
          <path
              d="M 0 9.45 L 20 9.45"
              stroke-miterlimit="10"
              pointer-events="stroke"
          />
          <ellipse
              class="red-light"
              :class="{ active: sig.stop }"
              cx="17.5"
              cy="9.5"
              rx="2.5"
              ry="2.5"
              pointer-events="all"
          />
          <ellipse
              class="green-light"
              :class="{ active: !sig.stop }"
              cx="10"
              cy="9.5"
              rx="2.5"
              ry="2.5"
              pointer-events="all"
          />
        </g>
      </svg>
    </template>
  </div>
</template>

<style lang="scss">
$basic-red: #e2002a;
$light-red: lighten($basic-red, 20%);
.track.signal {
  svg {
    &.signal {
      padding-top: 17px;
    }
    path,
    ellipse,
    rect,
    line {
      fill: #fff;
      stroke: #000;
      stroke-miterlimit: 10;
      stroke-width: 1px;
    }
    .green-light {
      fill: #ceefd8;
      &.active {
        fill: #42b983;
      }
    }

    .red-light {
      fill: #e5a9b3;
      &.active {
        fill: $basic-red;
      }
    }
  }

  &.is-occupied svg .main {
    fill: $light-red;
  }
}
</style>

<script lang="ts">
import { StraightWithSignal } from '@/railway'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() private sig!: StraightWithSignal
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
