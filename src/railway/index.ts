export enum TrackType {
  Siding = "Siding",
  Straight = "Straight",
  StraightWithSignal = "StraightWithSignal",
  Switch = "Switch"
}

export class RailWayError extends Error {
  constructor(public readonly message: string) {
    super();
  }
}

export class Crash extends RailWayError {
  constructor() {
    super("Zusammenstoß");
  }
}

export class SwitchNotReady extends RailWayError {
  constructor() {
    super("Weiche von der falschen Seite befahren");
  }
}

export class Train {
  protected forward = true;
  protected pos: TrackElement | null = null;

  public setPosition(pos: TrackElement) {
    this.pos = pos;
    pos.occupy(this, null);
  }

  public move() {
    if (!this.pos) {
      return;
    }

    if (this.pos.stopInDir(this.forward)) {
      return;
    }

    if (!this.canMove()) return;

    this.assertSecure();

    this.prepareMove();

    const prev = this.pos;
    prev.freeUp();
    this.pos = this.forward ? this.pos.next() : this.pos.prev();
    this.pos && this.pos.occupy(this, prev);
  }

  protected assertSecure(): void {
    // void
  }

  protected canMove(): boolean {
    return true;
  }

  protected prepareMove(): void {
    // void
  }

  public changeDir() {
    this.forward = !this.forward;
  }
}

export class TrainWithCompanion extends Train {
  protected canMove(): boolean {
    // look two elements into direction
    const el = this.forward
      ? this.pos?.next()?.next()
      : this.pos?.prev()?.prev();

    return !el || !el.isOccupied;
  }

  protected prepareMove() {
    super.prepareMove();
    const next = this.forward ? this.pos?.next() : this.pos?.prev();
    if (!next) return;
    if (!this.pos) return;

    if (next.type() !== TrackType.Switch) return;
    if (next.isOccupied) return;
    if (!(next as Switch).isReady(this.pos)) {
      (next as Switch).switch();
    }
  }
}

export abstract class TrackElement {
  private n: TrackElement | null = null;
  private p: TrackElement | null = null;
  private occupiedBy: Train | null = null;

  abstract type(): TrackType;

  public stopInDir(next: boolean): boolean {
    return false;
  }

  public get isOccupied(): boolean {
    return this.occupiedBy !== null;
  }

  public occupy(train: Train, from: TrackElement | null): void {
    if (this.isOccupied) {
      throw new Crash();
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

    return el;
  }

  public setPrevious(el: TrackElement): void {
    this.p = el;
  }

  public setNext(el: TrackElement): void {
    this.n = el;
  }
}

export class Straight extends TrackElement {
  type(): TrackType {
    return TrackType.Straight;
  }
}

export class StraightWithSignal extends Straight {
  get stop(): boolean {
    return this._stop;
  }
  public stopInDir(next: boolean): boolean {
    return this.stop && this.reverse !== next;
  }

  public change(): void {
    this._stop = !this._stop;
  }

  freeUp() {
    super.freeUp();
    this._stop = true;
  }

  private _stop = true;
  constructor(public readonly reverse = false) {
    super();
  }

  type(): TrackType {
    return TrackType.StraightWithSignal;
  }
}

export class Siding extends TrackElement {
  type(): TrackType {
    return TrackType.Siding;
  }
}

export class Switch extends TrackElement {
  get junctionEl(): TrackElement | null {
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
  private _junctionEl: TrackElement | null = null;

  public switch(): void {
    this._dirStraight = !this._dirStraight;
  }

  occupy(train: Train, from: TrackElement | null) {
    if (from && !this.isReady(from)) {
      throw new SwitchNotReady();
    }

    super.occupy(train, from);
  }

  public isReady(from: TrackElement): boolean {
    if (this._dirStraight) {
      return this.next() === from || this.prev() === from;
    }

    if (this._junctionEl === from) return true;

    return (
      (this.reverse && this.next() === from) ||
      (!this.reverse && this.prev() === from)
    );
  }

  public junction(e: TrackElement): TrackElement {
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

export class Track {
  constructor(public readonly trackBegin: TrackElement) {}
}
