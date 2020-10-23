<template functional>
  <div class="description">
    <dl>
      <dt>
        <button>&gt;</button> /
        <button>&lt;</button>
      </dt>
      <dd>
        Anklicken um einen Zug in die Richtung zu starten. Vorsicht vor
        Kollisionen!
      </dd>

      <dt>
        <svg
          width="22px"
          height="13px"
          viewBox="-0.5 -0.5 22 13"
          class="signal"
        >
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
              cx="17.5"
              cy="9.5"
              rx="2.5"
              ry="2.5"
              pointer-events="all"
            />
            <ellipse
              class="green-light"
              cx="10"
              cy="9.5"
              rx="2.5"
              ry="2.5"
              pointer-events="all"
            />
          </g>
        </svg>
      </dt>
      <dd>
        Anklicken um Signal auf grün oder rot zu schalten.
      </dd>
      <dt>
        <svg width="20px" height="20px" viewBox="0 0 19.61 10.49">
          <path d="M-368.5-112.5" transform="translate(-1.45 -0.56)" />
          <path
            class="main"
            d="M21,6.59v.14a.14.14,0,0,0-.14-.14H11.55a.16.16,0,0,1-.09,0L5,.65a.13.13,0,0,0-.18,0l-3.25,3a.15.15,0,0,0,0,.21L4.36,6.37a.14.14,0,0,1-.1.24H1.64a.14.14,0,0,0-.14.14v4.11a.14.14,0,0,0,.14.14H20.87a.14.14,0,0,0,.14-.14V9.24"
            transform="translate(-1.45 -0.56)"
          />
          <path d="M21,9.24" transform="translate(-1.45 -0.56)" />
          <line x1="2.81" y1="6.05" x2="10.1" y2="6.03" />
        </svg>
      </dt>
      <dd>
        Anklicken um Weiche umzustellen.
      </dd>
    </dl>
  </div>
</template>

<style lang="scss">
.description {
  display: block;
  width: 500px;
  margin: auto;

  dl {
    display: grid;
    grid-template-columns: 1fr 3fr;

    dt,
    dd {
      padding: 20px;
    }
  }
}
$basic-red: #e2002a;
svg.signal {
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
</style>
