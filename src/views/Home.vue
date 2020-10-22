<template>
  <div class="home">
    <div>
      <label
        >Speed <input type="number" min="1" max="50" v-model="speed"
      /></label>
    </div>

    <p>&nbsp;</p>
    <hr
      style="border: 1px lightgray solid; width: 80vw; margin-bottom: 100px; margin-top: 100px"
    />
    <p>&nbsp;</p>

    <table class="center tracks">
      <tr v-for="(row, rowIdx) in rows" :key="`track_row_${rowIdx}`">
        <td v-for="(col, colIdx) in row" :key="`track_col_${rowIdx}_${colIdx}`">
          <template v-if="col && col.type() === 'anschluss'">
            <button v-if="!col.prev()" @click="startTrain(col)">&gt;</button>
            <div
              class="track anschluss"
              :class="{ 'is-occupied': col.isOccupied }"
            ></div>
            <button v-if="!col.next()" @click="startTrain(col)">&lt;</button>
          </template>
          <div
            v-else-if="col"
            class="track"
            :class="{ 'is-occupied': col.isOccupied, [col.type()]: true }"
          ></div>
          <div class="empty" v-else></div>
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

.track {
  display: inline-block;
  width: 20px;
  height: 5px;
  //margin: 2px;
  border: 5px solid black;
  border-radius: 5px;
  padding: 1px;

  &.straight {
  }

  &.anschluss {
    opacity: 0.5;
  }

  &.is-occupied {
    background: $light-red;
  }
}

table {
  &.center {
    margin-left: auto;
    margin-right: auto;
  }

  &.tracks {
    border: 1px solid darkgrey;
    border-collapse: collapse;
    & th,
    td {
      border: 1px solid darkgrey;
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

  abstract type(): string;

  public get isOccupied(): boolean {
    return this.occupiedBy !== null;
  }

  public occupy(train: Train): void {
    // TODO detect collision!!
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

  public setPrevious(el: TrackElement): void {
    this.p = el;
  }
}

class Straight extends TrackElement {
  type(): string {
    return "straight";
  }
}

class Anschluss extends TrackElement {
  type(): string {
    return "anschluss";
  }
}

const trackBegin = new Anschluss();
trackBegin
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Straight())
  .append(new Anschluss());

class Track {
  constructor(public readonly trackBegin: TrackElement) {}
}

@Component({
  components: {}
})
export default class Home extends Vue {
  track = new Track(trackBegin);
  trains = [] as Train[];
  speed = 2;

  get rows() {
    // let cols = 0;
    let cur = this.track.trackBegin;
    const rows = [[]];
    let curRow = 0;

    do {
      rows[curRow].push(cur);
      cur = cur.next();
    } while (cur);
    ++curRow;

    return rows;
  }

  startTrain(el: Anschluss): void {
    const train = new Train();
    train.setPosition(el);
    if (el.prev()) {
      train.changeDir();
    }

    this.trains.push(train);
  }

  moveTrains() {
    this.trains.forEach(t => t.move());
    setTimeout(this.moveTrains, 2000 / this.speed);
  }

  mounted() {
    setTimeout(this.moveTrains, 2000 / this.speed);
  }
}
</script>
