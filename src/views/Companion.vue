<template>
  <div class="home">
    <div>
      <p>
        <label
          >Speed <input type="number" min="1" max="50" v-model="speed"
        /></label>
      </p>
      <p>
        <button @click="reset()">reset</button>
      </p>
    </div>

    <p>&nbsp;</p>
    <hr
      style="border: 1px lightgray solid; width: 80vw; margin-bottom: 100px; margin-top: 100px"
    />
    <p>&nbsp;</p>

    <div v-show="error" class="error-container">{{ error }}</div>

    <table class="center tracks">
      <tr v-for="(row, rowIdx) in rows" :key="`track_row_${rowIdx}`">
        <td v-for="(col, colIdx) in row" :key="`track_col_${rowIdx}_${colIdx}`">
          <div class="empty" v-if="!col"></div>
          <template v-else-if="col.type() === trackType.Siding">
            <button v-if="!col.prev()" @click="startTrain(col)">&gt;</button>
            <div
              class="track Siding"
              :class="{ 'is-occupied': col.isOccupied }"
            >
              <svg width="6px" height="6px" viewBox="-0.5 -0.5 6 6">
                <g>
                  <rect
                    x="0"
                    y="0"
                    width="5"
                    height="5"
                    rx="0.75"
                    ry="0.75"
                    class="el"
                  />
                </g>
              </svg>
            </div>
            <button v-if="!col.next()" @click="startTrain(col)">&lt;</button>
          </template>
          <div
            v-else-if="col.type() === trackType.Switch"
            class="track"
            :class="{
              'is-occupied': col.isOccupied
            }"
          >
            <switch-el :junc="col" />
          </div>
          <div
            v-else-if="col.type() === trackType.Straight"
            class="track"
            :class="{
              'is-occupied': col.isOccupied
            }"
          >
            <svg width="21px" height="6px" viewBox="-0.5 -0.5 21 6">
              <defs />
              <g>
                <rect
                  x="0"
                  y="0"
                  width="20"
                  height="5"
                  rx="0.75"
                  ry="0.75"
                  class="el"
                />
              </g>
            </svg>
          </div>
          <div
            v-else-if="col.type() === trackType.StraightWithSignal"
            class="track"
          >
            <signal-el :sig="col" />
          </div>
        </td>
      </tr>
    </table>

    <p>&nbsp;</p>
    <hr
      style="border: 1px lightgray solid; width: 80vw; margin-bottom: 100px; margin-top: 100px"
    />
    <p>&nbsp;</p>

    <Description />
  </div>
</template>

<style lang="scss">
$basic-red: #e2002a;
$light-red: lighten($basic-red, 20%);
$grey: #666;
$light-grey: lighten($grey, 25%);

.error-container {
  color: $basic-red;
  font-size: larger;
  width: 350px;
  min-height: 50px;
  margin: 50px auto;
  padding: 10px;
  border: $basic-red 1px solid;
  border-radius: 5px;
}

.track {
  display: inline-block;
  padding: 1px;

  & svg {
    & .el {
      fill: white;
      stroke: black;
    }
  }

  //svg {
  //  stroke: black;
  //  width: 1px;
  //}

  &.Siding {
    opacity: 0.5;
    margin-top: 9px;
  }

  &.is-occupied {
    & svg {
      & .el {
        fill: $light-red;
      }
    }
    // background: $light-red;
  }
}

table {
  &.center {
    margin-left: auto;
    margin-right: auto;
  }

  &.tracks {
    /// border: 1px solid darkgrey;
    border: 0;
    border-collapse: collapse;
    & th,
    td {
      // border: 1px solid darkgrey;
      vertical-align: middle;
      & > button {
        font-size: x-small;
        display: inline-block;
        margin-bottom: 10px;
        //width: 20px;
        //height: 5px;
        //margin: 2px;
        //padding: 1px;
      }
    }
  }
}
</style>

<script lang="ts">
import Description from "@/components/Description.vue";
import SwitchEl from "@/components/Switch.vue";
import SignalEl from "@/components/Signal.vue";
import {
  Siding,
  Straight,
  StraightWithSignal,
  Switch,
  TrackElement,
  TrackType,
  TrainWithCompanion
} from "@/railway";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: { Description, SwitchEl, SignalEl }
})
export default class Home extends Vue {
  trackType = TrackType;
  trains = [] as TrainWithCompanion[];
  currentSpeed = 4;
  error: string | null = null;
  interval: number | null = null;
  rows = [] as Array<Array<TrackElement | null | undefined>>;

  get speed(): number {
    return this.currentSpeed;
  }
  set speed(n: number) {
    this.currentSpeed = n;
    this.updateInterval(n);
  }

  reset() {
    this.error = null;
    this.trains = [];
    this.buildTrack();
    this.updateInterval(this.currentSpeed);
  }

  updateInterval(speed: number): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(this.moveTrains, 1000 / speed);
  }

  startTrain(el: Siding): void {
    if (el.isOccupied) return;
    const train = new TrainWithCompanion();
    train.setPosition(el);
    if (el.prev()) {
      train.changeDir();
    }

    this.trains.push(train);
  }

  buildTrack(): void {
    const rows = [[], []] as Array<Array<TrackElement | null | undefined>>;
    const trackBegin = new Siding();

    let col = 0;

    rows[0][col] = null;
    rows[1][col] = trackBegin;

    rows[0][++col] = null;
    rows[1][col] = trackBegin.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(Switch.forwardNorth());
    (rows[1][col] as Switch).switch();

    rows[0][++col] = (rows[1][col - 1] as Switch | null | undefined)?.junction(
      new StraightWithSignal(true)
    );
    rows[1][col] = rows[1][col - 1]?.append(new StraightWithSignal(true));

    rows[0][++col] = rows[0][col - 1]?.append(new Straight());
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = rows[0][col - 1]?.append(new Straight());
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = rows[0][col - 1]?.append(new StraightWithSignal());
    rows[1][col] = rows[1][col - 1]?.append(new StraightWithSignal());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(Switch.reverseNorth());
    (rows[1][col] as Switch).junction(rows[0][col - 1] as TrackElement);

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(Switch.forwardNorth());

    rows[0][++col] = (rows[1][col - 1] as Switch | null | undefined)?.junction(
      new StraightWithSignal(true)
    );
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = rows[0][col - 1]?.append(new Straight());
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = rows[0][col - 1]?.append(new Siding());
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(Switch.forwardNorth());
    (rows[1][col] as Switch).switch();

    rows[0][++col] = (rows[1][col - 1] as Switch | null | undefined)?.junction(
      new StraightWithSignal(true)
    );
    rows[1][col] = rows[1][col - 1]?.append(new StraightWithSignal(true));

    rows[0][++col] = rows[0][col - 1]?.append(new Straight());
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = rows[0][col - 1]?.append(new Straight());
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = rows[0][col - 1]?.append(new StraightWithSignal());
    rows[1][col] = rows[1][col - 1]?.append(new StraightWithSignal());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(Switch.reverseNorth());
    (rows[1][col] as Switch).junction(rows[0][col - 1] as TrackElement);

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Straight());

    rows[0][++col] = null;
    rows[1][col] = rows[1][col - 1]?.append(new Siding());

    this.rows = rows;
  }

  moveTrains() {
    if (this.error) return;
    try {
      this.trains.forEach(t => t.move());
    } catch (e) {
      this.error = e.message || "Unbekannter Fehler";
    }
  }

  mounted() {
    this.reset();
  }
}
</script>
