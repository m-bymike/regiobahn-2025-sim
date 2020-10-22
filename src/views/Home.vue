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
              <svg width="21px" height="6px" viewBox="-0.5 -0.5 21 6"><g><rect x="0" y="0" width="20" height="5" rx="0.75" ry="0.75" class="el"/></g></svg>
            </div>
            <button v-if="!col.next()" @click="startTrain(col)">&lt;</button>
          </template>
          <div v-else-if="col.type() === trackType.Switch" class="track" :class="{
              'is-occupied': col.isOccupied
            }">
            <svg width="21px" height="20px" viewBox="-0.5 -0.5 21 20">
              <g :transform="col.reverse ? 'translate(20,0) scale(-1,1)' : ''">
                <rect v-if="!col.dirStraight" class="el" x="0" y="12" width="20" height="5" rx="0.75" ry="0.75"/>
                <rect x="0" y="7" width="20" height="5" rx="0.75" ry="0.75" class="el" transform="rotate(-45,10,9.5)"
                      pointer-events="all"/>
                <rect v-if="col.dirStraight" class="el" x="0" y="12" width="20" height="5" rx="0.75" ry="0.75"/>
              </g></svg>
          </div>
          <div
            v-else-if="col.type() === trackType.Straight"
            class="track"
            :class="{
              'is-occupied': col.isOccupied
            }"
          >
            <svg width="21px" height="6px" viewBox="-0.5 -0.5 21 6"><defs/><g><rect x="0" y="0" width="20" height="5" rx="0.75" ry="0.75" class="el"/></g></svg>
          </div>
        </td>
      </tr>
    </table>
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
import { Component, Vue } from "vue-property-decorator";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

enum TrackType {
  Siding = "Siding",
  Straight = "Straight",
  Switch = "Switch"
}

class Crash extends Error {
  constructor(public readonly message: string) {
    super();
  }
}

class Train {
  private forward = true;
  private pos: TrackElement;

  public setPosition(pos: TrackElement) {
    this.pos = pos;
    pos.occupy(this);
  }

  public move() {
    if (!this.pos) {
      return;
    }

    this.pos.freeUp();
    this.pos = this.forward ? this.pos.next() : this.pos.prev();
    this.pos && this.pos.occupy(this);
  }

  public changeDir() {
    this.forward = !this.forward;
  }
}

abstract class TrackElement {
  private n: TrackElement | null = null;
  private p: TrackElement | null = null;
  private occupiedBy: Train | null = null;

  abstract type(): TrackType;

  public get isOccupied(): boolean {
    return this.occupiedBy !== null;
  }

  public occupy(train: Train): void {
    if (this.isOccupied) {
      throw new Crash("Zusammenstoss!");
    }
    this.occupiedBy = train;
  }

  public freeUp(): void {
    this.occupiedBy = null;
  }

  next(): TrackElement | null {
    return this.n;
  }

  prev(): TrackElement | null {
    return this.p;
  }

  public append(el: TrackElement): TrackElement {
    this.n = el;
    el.setPrevious(this);

    return el;
  }

  public prepend(el: TrackElement): TrackElement {
    this.p = el;
    el.setNext(this);
  }

  public setPrevious(el: TrackElement): void {
    this.p = el;
  }

  public setNext(el: TrackElement): void {
    this.n = el;
  }
}

class Straight extends TrackElement {
  type(): TrackType {
    return TrackType.Straight;
  }
}

class Siding extends TrackElement {
  type(): TrackType {
    return TrackType.Siding;
  }
}

class Switch extends TrackElement {
  get junctionEl(): TrackElement {
    return this._junctionEl;
  }
  get dirStraight(): boolean {
    return this._dirStraight;
  }
  public static forwardNorth(): Switch {
    return new Switch(true, false);
  }

  public static forwardSouth(): Switch {
    return new Switch(false, false);
  }

  public static reverseSouth(): Switch {
    return new Switch(true, true);
  }

  public static reverseNorth(): Switch {
    return new Switch(false, true);
  }

  constructor(public readonly left = true, public readonly reverse = false) {
    super();
  }

  private _dirStraight = true;
  private _junctionEl: TrackElement = null;

  public switch(): void {
    this._dirStraight = !this._dirStraight;
  }

  public junction(e: TrackElement): void {
    this._junctionEl = e;
    if (this.reverse) {
      e.setNext(this);
    } else {
      e.setPrevious(this);
    }

    return e;
  }

  next(): TrackElement | null {
    if (this.reverse || this._dirStraight) return super.next();
    return this._junctionEl;
  }

  prev(): TrackElement | null {
    if (!this.reverse || this._dirStraight) return super.prev();
    return this._junctionEl;
  }

  type(): TrackType {
    return TrackType.Switch;
  }
}

class Track {
  constructor(public readonly trackBegin: TrackElement) {}
}

@Component({
  components: {}
})
export default class Home extends Vue {
  trackType = TrackType;
  track: Track = null;
  trains = [] as Train[];
  currentSpeed = 4;
  error: string = null;
  interval = null;
  rows = [];

  // get rows() {
  //   if (!this.track) return [];
  //
  //   let cur = this.track.trackBegin;
  //   const rows = [[], []];
  //   let curRow = 1;
  //
  //   do {
  //     if ()
  //     rows[curRow].push(cur);
  //     cur = cur.next();
  //   } while (cur);
  //   ++curRow;
  //
  //   return rows;
  // }
  get speed(): number {
    return this.currentSpeed;
  }
  set speed(n: number) {
    this.currentSpeed = n;
    this.updateInterval(n);
  }

  reset() {
    this.error = null;
    // this.error = "FOO BAR";
    this.trains = [];
    this.track = this.buildTrack();
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
    const train = new Train();
    train.setPosition(el);
    if (el.prev()) {
      train.changeDir();
    }

    this.trains.push(train);
  }

  buildTrack() {
    const rows = [[], []];
    const trackBegin = new Siding();

    rows[0][0] = null;
    rows[1][0] = trackBegin;

    rows[0][1] = null;
    rows[1][1] = trackBegin.append(new Straight());

    rows[0][2] = null;
    rows[1][2] = rows[1][1].append(new Straight());

    rows[0][3] = null;
    rows[1][3] = rows[1][2].append(new Straight());

    rows[0][4] = null;
    rows[1][4] = rows[1][3].append(new Straight());

    rows[0][5] = null;
    rows[1][5] = rows[1][4].append(Switch.forwardNorth());
    rows[1][5].switch();

    rows[0][6] = rows[1][5].junction(new Straight());
    rows[1][6] = rows[1][5].append(new Straight());

    rows[0][7] = rows[0][6].append(new Straight());
    rows[1][7] = rows[1][6].append(new Straight());

    rows[0][8] = rows[0][7].append(new Straight());
    rows[1][8] = rows[1][7].append(new Straight());

    rows[0][8] = rows[0][7].append(new Straight());
    rows[1][8] = rows[1][7].append(new Straight());

    rows[0][9] = null;
    rows[1][9] = rows[1][8].append(Switch.reverseNorth());
    rows[1][9].junction(rows[0][8]);

    rows[0][10] = null;
    rows[1][10] = rows[1][9].append(new Straight());

    rows[0][11] = null;
    rows[1][11] = rows[1][10].append(new Straight());

    rows[0][12] = null;
    rows[1][12] = rows[1][11].append(new Straight());

    rows[0][13] = null;
    rows[1][13] = rows[1][12].append(new Straight());

    rows[0][14] = null;
    rows[1][14] = rows[1][13].append(new Siding());

    this.rows = rows;
    this.track = new Track(trackBegin);
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
