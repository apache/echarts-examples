
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
interface NameMap {
    [regionName: string]: string;
}
interface GeoSpecialAreas {
    [areaName: string]: {
        left: number;
        top: number;
        width?: number;
        height?: number;
    };
}
interface GeoJSON extends GeoJSONFeatureCollection<GeoJSONGeometry> {
}
interface GeoJSONCompressed extends GeoJSONFeatureCollection<GeoJSONGeometryCompressed> {
    UTF8Encoding?: boolean;
    UTF8Scale?: number;
}
interface GeoJSONFeatureCollection<G> {
    type: 'FeatureCollection';
    features: GeoJSONFeature<G>[];
}
interface GeoJSONFeature<G = GeoJSONGeometry> {
    type: 'Feature';
    id?: string | number;
    properties: {
        name?: string;
        cp?: number[];
        [key: string]: any;
    };
    geometry: G;
}
declare type GeoJSONGeometry = GeoJSONGeometryPoint | GeoJSONGeometryMultiPoint | GeoJSONGeometryLineString | GeoJSONGeometryMultiLineString | GeoJSONGeometryPolygon | GeoJSONGeometryMultiPolygon;
declare type GeoJSONGeometryCompressed = GeoJSONGeometryPoint | GeoJSONGeometryMultiPoint | GeoJSONGeometryLineString | GeoJSONGeometryMultiLineString | GeoJSONGeometryPolygonCompressed | GeoJSONGeometryMultiPolygonCompressed;
interface GeoJSONGeometryPoint {
    type: 'Point';
    coordinates: number[];
}
interface GeoJSONGeometryMultiPoint {
    type: 'MultiPoint';
    coordinates: number[][];
}
interface GeoJSONGeometryLineString {
    type: 'LineString';
    coordinates: number[][];
}
interface GeoJSONGeometryMultiLineString {
    type: 'MultiLineString';
    coordinates: number[][][];
}
interface GeoJSONGeometryPolygon {
    type: 'Polygon';
    coordinates: number[][][];
}
interface GeoJSONGeometryPolygonCompressed {
    type: 'Polygon';
    coordinates: string[];
    encodeOffsets: number[][];
}
interface GeoJSONGeometryMultiPolygon {
    type: 'MultiPolygon';
    coordinates: number[][][][];
}
interface GeoJSONGeometryMultiPolygonCompressed {
    type: 'MultiPolygon';
    coordinates: string[][];
    encodeOffsets: number[][][];
}

interface GradientObject {
    id?: number;
    type: string;
    colorStops: GradientColorStop[];
    __canvasGradient: CanvasGradient;
}
interface GradientColorStop {
    offset: number;
    color: string;
}

interface RadialGradientObject extends GradientObject {
    type: 'radial';
    x: number;
    y: number;
    r: number;
    global: boolean;
}

interface LinearGradientObject extends GradientObject {
    type: 'linear';
    x: number;
    y: number;
    x2: number;
    y2: number;
    global: boolean;
}

declare type Dictionary<T> = {
    [key: string]: T;
};
declare type ImageLike = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
declare type TextVerticalAlign = 'top' | 'middle' | 'bottom';
declare type TextAlign = 'left' | 'center' | 'right';
declare type BuiltinTextPosition = 'left' | 'right' | 'top' | 'bottom' | 'inside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight';
declare type ZREventProperties = {
    zrX: number;
    zrY: number;
    zrDelta: number;
    zrEventControl: 'no_globalout' | 'only_globalout';
    zrIsToLocalDOM: boolean;
    zrByTouch: boolean;
};
declare type ZRRawMouseEvent = MouseEvent & ZREventProperties;
declare type ZRRawTouchEvent = TouchEvent & ZREventProperties;
declare type ZRRawPointerEvent = TouchEvent & ZREventProperties;
declare type ZRRawEvent = ZRRawMouseEvent | ZRRawTouchEvent | ZRRawPointerEvent;
declare type ElementEventName = 'click' | 'dblclick' | 'mousewheel' | 'mouseout' | 'mouseover' | 'mouseup' | 'mousedown' | 'mousemove' | 'contextmenu' | 'drag' | 'dragstart' | 'dragend' | 'dragenter' | 'dragleave' | 'dragover' | 'drop';
declare type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
declare type MapToType<T extends Dictionary<any>, S> = {
    [P in keyof T]: T[P] extends Dictionary<any> ? MapToType<T[P], S> : S;
};

declare type CanvasPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
interface PatternObject {
    id?: number;
    type: 'pattern';
    image: ImageLike | string;
    svgElement: SVGElement;
    svgWidth: number;
    svgHeight: number;
    repeat: CanvasPatternRepeat;
    x?: number;
    y?: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    __image?: ImageLike;
}

declare type EventCallback<Ctx, Impl, EvtParam = unknown> = (this: CbThis<Ctx, Impl>, eventParam?: EvtParam, ...args: unknown[]) => boolean | void;
declare type EventQuery = string | Object;
declare type CbThis<Ctx, Impl> = unknown extends Ctx ? Impl : Ctx;
declare type DefaultEventDefinition = {
    [eventName: string]: unknown;
};
interface EventProcessor<EvtDef = DefaultEventDefinition> {
    normalizeQuery?: (query: EventQuery) => EventQuery;
    filter?: (eventType: keyof EvtDef, query: EventQuery) => boolean;
    afterTrigger?: (eventType: keyof EvtDef) => void;
}
declare class Eventful<EvtDef = DefaultEventDefinition> {
    private _$handlers;
    protected _$eventProcessor: EventProcessor<EvtDef>;
    constructor(eventProcessors?: EventProcessor<EvtDef>);
    on<Ctx, EvtNm extends keyof EvtDef>(event: EvtNm, handler: EventCallback<Ctx, this, EvtDef[EvtNm]>, context?: Ctx): this;
    on<Ctx, EvtNm extends keyof EvtDef>(event: EvtNm, query: EventQuery, handler: EventCallback<Ctx, this, EvtDef[EvtNm]>, context?: Ctx): this;
    isSilent(eventName: keyof EvtDef): boolean;
    off(eventType?: keyof EvtDef, handler?: Function): this;
    trigger(eventType: keyof EvtDef, eventParam?: EvtDef[keyof EvtDef], ...args: any[]): this;
    triggerWithContext(type: keyof EvtDef): this;
}

declare type VectorArray = number[];

declare type MatrixArray = number[];

interface PointLike {
    x: number;
    y: number;
}
declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    copy(other: PointLike): this;
    clone(): Point;
    set(x: number, y: number): this;
    equal(other: PointLike): boolean;
    add(other: PointLike): this;
    scale(scalar: number): void;
    scaleAndAdd(other: PointLike, scalar: number): void;
    sub(other: PointLike): this;
    dot(other: PointLike): number;
    len(): number;
    lenSquare(): number;
    normalize(): this;
    distance(other: PointLike): number;
    distanceSquare(other: Point): number;
    negate(): this;
    transform(m: MatrixArray): this;
    toArray(out: number[]): number[];
    fromArray(input: number[]): void;
    static set(p: PointLike, x: number, y: number): void;
    static copy(p: PointLike, p2: PointLike): void;
    static len(p: PointLike): number;
    static lenSquare(p: PointLike): number;
    static dot(p0: PointLike, p1: PointLike): number;
    static add(out: PointLike, p0: PointLike, p1: PointLike): void;
    static sub(out: PointLike, p0: PointLike, p1: PointLike): void;
    static scale(out: PointLike, p0: PointLike, scalar: number): void;
    static scaleAndAdd(out: PointLike, p0: PointLike, p1: PointLike, scalar: number): void;
    static lerp(out: PointLike, p0: PointLike, p1: PointLike, t: number): void;
}

declare class BoundingRect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    union(other: BoundingRect): void;
    applyTransform(m: MatrixArray): void;
    calculateTransform(b: RectLike): MatrixArray;
    intersect(b: RectLike, mtv?: PointLike): boolean;
    contain(x: number, y: number): boolean;
    clone(): BoundingRect;
    copy(other: RectLike): void;
    plain(): RectLike;
    isFinite(): boolean;
    isZero(): boolean;
    static create(rect: RectLike): BoundingRect;
    static copy(target: RectLike, source: RectLike): void;
    static applyTransform(target: RectLike, source: RectLike, m: MatrixArray): void;
}
declare type RectLike = {
    x: number;
    y: number;
    width: number;
    height: number;
};

interface ExtendedCanvasRenderingContext2D extends CanvasRenderingContext2D {
    dpr?: number;
}
declare class PathProxy {
    dpr: number;
    data: number[] | Float32Array;
    private _version;
    private _saveData;
    private _ctx;
    private _xi;
    private _yi;
    private _x0;
    private _y0;
    private _len;
    private _pathSegLen;
    private _pathLen;
    private _ux;
    private _uy;
    private _lineDash;
    private _needsDash;
    private _dashOffset;
    private _dashIdx;
    private _dashSum;
    static CMD: {
        M: number;
        L: number;
        C: number;
        Q: number;
        A: number;
        Z: number;
        R: number;
    };
    constructor(notSaveData?: boolean);
    increaseVersion(): void;
    getVersion(): number;
    setScale(sx: number, sy: number, segmentIgnoreThreshold?: number): void;
    setDPR(dpr: number): void;
    setContext(ctx: ExtendedCanvasRenderingContext2D): void;
    getContext(): ExtendedCanvasRenderingContext2D;
    beginPath(): this;
    reset(): void;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): this;
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): this;
    arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
    rect(x: number, y: number, w: number, h: number): this;
    closePath(): this;
    fill(ctx: CanvasRenderingContext2D): void;
    stroke(ctx: CanvasRenderingContext2D): void;
    setLineDash(lineDash: number[] | false): this;
    setLineDashOffset(offset: number): this;
    len(): number;
    setData(data: Float32Array | number[]): void;
    appendPath(path: PathProxy | PathProxy[]): void;
    addData(cmd: number, a?: number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number, h?: number): void;
    _expandData(): void;
    _dashedLineTo(x1: number, y1: number): void;
    _dashedBezierTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    _dashedQuadraticTo(x1: number, y1: number, x2: number, y2: number): void;
    toStatic(): void;
    getBoundingRect(): BoundingRect;
    private _calculateLength;
    rebuildPath(ctx: PathRebuilder, percent: number): void;
    private static initDefaultProps;
}
interface PathRebuilder {
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    bezierCurveTo(x: number, y: number, x2: number, y2: number, x3: number, y3: number): void;
    quadraticCurveTo(x: number, y: number, x2: number, y2: number): void;
    arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
    ellipse(cx: number, cy: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
    rect(x: number, y: number, width: number, height: number): void;
    closePath(): void;
}

declare type easingFunc = (percent: number) => number;
declare type AnimationEasing = keyof typeof easing | easingFunc | 'spline';
declare const easing: {
    linear(k: number): number;
    quadraticIn(k: number): number;
    quadraticOut(k: number): number;
    quadraticInOut(k: number): number;
    cubicIn(k: number): number;
    cubicOut(k: number): number;
    cubicInOut(k: number): number;
    quarticIn(k: number): number;
    quarticOut(k: number): number;
    quarticInOut(k: number): number;
    quinticIn(k: number): number;
    quinticOut(k: number): number;
    quinticInOut(k: number): number;
    sinusoidalIn(k: number): number;
    sinusoidalOut(k: number): number;
    sinusoidalInOut(k: number): number;
    exponentialIn(k: number): number;
    exponentialOut(k: number): number;
    exponentialInOut(k: number): number;
    circularIn(k: number): number;
    circularOut(k: number): number;
    circularInOut(k: number): number;
    elasticIn(k: number): number;
    elasticOut(k: number): number;
    elasticInOut(k: number): number;
    backIn(k: number): number;
    backOut(k: number): number;
    backInOut(k: number): number;
    bounceIn(k: number): number;
    bounceOut(k: number): number;
    bounceInOut(k: number): number;
};

interface Stage {
    update?: () => void;
}
declare type OnframeCallback = (deltaTime: number) => void;
interface AnimationOption {
    stage?: Stage;
    onframe?: OnframeCallback;
}
declare class Animation extends Eventful {
    stage: Stage;
    onframe: OnframeCallback;
    private _clipsHead;
    private _clipsTail;
    private _running;
    private _time;
    private _pausedTime;
    private _pauseStart;
    private _paused;
    constructor(opts?: AnimationOption);
    addClip(clip: Clip): void;
    addAnimator(animator: Animator<any>): void;
    removeClip(clip: Clip): void;
    removeAnimator(animator: Animator<any>): void;
    update(notTriggerStageUpdate?: boolean): void;
    _startLoop(): void;
    start(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    clear(): void;
    isFinished(): boolean;
    animate<T>(target: T, options: {
        loop?: boolean;
    }): Animator<T>;
}

declare type OnframeCallback$1 = (percent: number) => void;
declare type ondestroyCallback = () => void;
declare type onrestartCallback = () => void;
interface ClipProps {
    life?: number;
    delay?: number;
    loop?: boolean;
    gap?: number;
    easing?: AnimationEasing;
    onframe?: OnframeCallback$1;
    ondestroy?: ondestroyCallback;
    onrestart?: onrestartCallback;
}
declare class Clip {
    private _life;
    private _delay;
    private _initialized;
    private _startTime;
    private _pausedTime;
    private _paused;
    animation: Animation;
    loop: boolean;
    gap: number;
    easing: AnimationEasing;
    next: Clip;
    prev: Clip;
    onframe: OnframeCallback$1;
    ondestroy: ondestroyCallback;
    onrestart: onrestartCallback;
    constructor(opts: ClipProps);
    step(globalTime: number, deltaTime: number): boolean;
    private _restart;
    pause(): void;
    resume(): void;
}

declare type Keyframe = {
    time: number;
    value: unknown;
    percent: number;
    additiveValue?: unknown;
};
declare class Track {
    keyframes: Keyframe[];
    maxTime: number;
    propName: string;
    useSpline: boolean;
    arrDim: number;
    isValueColor: boolean;
    interpolable: boolean;
    private _finished;
    private _needsSort;
    private _isAllValueEqual;
    private _additiveTrack;
    private _additiveValue;
    private _lastFrame;
    private _lastFramePercent;
    constructor(propName: string);
    isFinished(): boolean;
    setFinished(): void;
    needsAnimate(): boolean;
    getAdditiveTrack(): Track;
    addKeyframe(time: number, value: unknown): {
        time: number;
        value: unknown;
        percent: number;
    };
    prepare(additiveTrack?: Track): void;
    step(target: any, percent: number): void;
    private _addToTarget;
}
declare type DoneCallback = () => void;
declare type AbortCallback = () => void;
declare type OnframeCallback$2<T> = (target: T, percent: number) => void;
declare class Animator<T> {
    animation?: Animation;
    targetName?: string;
    scope?: string;
    __fromStateTransition?: string;
    private _tracks;
    private _trackKeys;
    private _target;
    private _loop;
    private _delay;
    private _maxTime;
    private _paused;
    private _started;
    private _additiveAnimators;
    private _doneList;
    private _onframeList;
    private _abortedList;
    private _clip;
    constructor(target: T, loop: boolean, additiveTo?: Animator<any>[]);
    getTarget(): T;
    changeTarget(target: T): void;
    when(time: number, props: Dictionary<any>): this;
    whenWithKeys(time: number, props: Dictionary<any>, propNames: string[]): this;
    pause(): void;
    resume(): void;
    isPaused(): boolean;
    private _doneCallback;
    private _abortedCallback;
    private _setTracksFinished;
    private _getAdditiveTrack;
    start(easing?: AnimationEasing, forceAnimate?: boolean): this;
    stop(forwardToLast?: boolean): void;
    delay(time: number): this;
    during(cb: OnframeCallback$2<T>): this;
    done(cb: DoneCallback): this;
    aborted(cb: AbortCallback): this;
    getClip(): Clip;
    getTrack(propName: string): Track;
    stopTracks(propNames: string[], forwardToLast?: boolean): boolean;
    saveFinalToTarget(target: T, trackKeys?: readonly string[]): void;
    __changeFinalValue(finalProps: Dictionary<any>, trackKeys?: readonly string[]): void;
}

interface PathStyleProps extends CommonStyleProps {
    fill?: string | PatternObject | LinearGradientObject | RadialGradientObject;
    stroke?: string | PatternObject | LinearGradientObject | RadialGradientObject;
    decal?: PatternObject;
    strokePercent?: number;
    strokeNoScale?: boolean;
    fillOpacity?: number;
    strokeOpacity?: number;
    lineDash?: false | number[] | 'solid' | 'dashed' | 'dotted';
    lineDashOffset?: number;
    lineWidth?: number;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
    miterLimit?: number;
    strokeFirst?: boolean;
}
interface PathProps extends DisplayableProps {
    strokeContainThreshold?: number;
    segmentIgnoreThreshold?: number;
    subPixelOptimize?: boolean;
    style?: PathStyleProps;
    shape?: Dictionary<any>;
    autoBatch?: boolean;
    __value?: (string | number)[] | (string | number);
    buildPath?: (ctx: PathProxy | CanvasRenderingContext2D, shapeCfg: Dictionary<any>, inBundle?: boolean) => void;
}
declare type PathKey = keyof PathProps;
declare type PathPropertyType = PropType<PathProps, PathKey>;
interface Path<Props extends PathProps = PathProps> {
    animate(key?: '', loop?: boolean): Animator<this>;
    animate(key: 'style', loop?: boolean): Animator<this['style']>;
    animate(key: 'shape', loop?: boolean): Animator<this['shape']>;
    getState(stateName: string): PathState;
    ensureState(stateName: string): PathState;
    states: Dictionary<PathState>;
    stateProxy: (stateName: string) => PathState;
}
declare class Path<Props extends PathProps = PathProps> extends Displayable<Props> {
    path: PathProxy;
    strokeContainThreshold: number;
    segmentIgnoreThreshold: number;
    subPixelOptimize: boolean;
    style: PathStyleProps;
    autoBatch: boolean;
    private _rectWithStroke;
    protected _normalState: PathState;
    protected _decalEl: Path;
    shape: Dictionary<any>;
    constructor(opts?: Props);
    update(): void;
    getDecalElement(): Path<PathProps>;
    protected _init(props?: Props): void;
    protected getDefaultStyle(): Props['style'];
    protected getDefaultShape(): {};
    protected canBeInsideText(): boolean;
    protected getInsideTextFill(): "#333" | "#ccc" | "#eee";
    protected getInsideTextStroke(textFill?: string): string;
    buildPath(ctx: PathProxy | CanvasRenderingContext2D, shapeCfg: Dictionary<any>, inBundle?: boolean): void;
    pathUpdated(): void;
    createPathProxy(): void;
    hasStroke(): boolean;
    hasFill(): boolean;
    getBoundingRect(): BoundingRect;
    contain(x: number, y: number): boolean;
    dirtyShape(): void;
    dirty(): void;
    animateShape(loop: boolean): Animator<this["shape"]>;
    updateDuringAnimation(targetKey: string): void;
    attrKV(key: PathKey, value: PathPropertyType): void;
    setShape(obj: Props['shape']): this;
    setShape<T extends keyof Props['shape']>(obj: T, value: Props['shape'][T]): this;
    shapeChanged(): boolean;
    createStyle(obj?: Props['style']): Props["style"];
    protected _innerSaveToNormal(toState: PathState): void;
    protected _applyStateObj(stateName: string, state: PathState, normalState: PathState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
    protected _mergeStates(states: PathState[]): PathState;
    getAnimationStyleProps(): MapToType<PathProps, boolean>;
    isZeroArea(): boolean;
    static extend<Shape extends Dictionary<any>>(defaultProps: {
        type?: string;
        shape?: Shape;
        style?: PathStyleProps;
        beforeBrush?: Displayable['beforeBrush'];
        afterBrush?: Displayable['afterBrush'];
        getBoundingRect?: Displayable['getBoundingRect'];
        calculateTextPosition?: Element['calculateTextPosition'];
        buildPath(this: Path, ctx: CanvasRenderingContext2D | PathProxy, shape: Shape, inBundle?: boolean): void;
        init?(this: Path, opts: PathProps): void;
    }): {
        new (opts?: PathProps & {
            shape: Shape;
        }): Path;
    };
    static SHAPE_CHANGED_BIT: number;
    protected static initDefaultProps: void;
}
declare type PathStatePropNames = DisplayableStatePropNames | 'shape';
declare type PathState = Pick<PathProps, PathStatePropNames> & {
    hoverLayer?: boolean;
};

declare class Transformable {
    parent: Transformable;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    originX: number;
    originY: number;
    globalScaleRatio: number;
    transform: MatrixArray;
    invTransform: MatrixArray;
    setPosition(arr: number[]): void;
    setScale(arr: number[]): void;
    setOrigin(arr: number[]): void;
    needLocalTransform(): boolean;
    updateTransform(): void;
    private _resolveGlobalScaleRatio;
    getLocalTransform(m?: MatrixArray): MatrixArray;
    getComputedTransform(): MatrixArray;
    setLocalTransform(m: VectorArray): void;
    decomposeTransform(): void;
    getGlobalScale(out?: VectorArray): VectorArray;
    transformCoordToLocal(x: number, y: number): number[];
    transformCoordToGlobal(x: number, y: number): number[];
    getLineScale(): number;
    static getLocalTransform(target: Transformable, m?: MatrixArray): MatrixArray;
    private static initDefaultProps;
}

interface TSpanStyleProps extends PathStyleProps {
    x?: number;
    y?: number;
    text?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
}
interface TSpanProps extends DisplayableProps {
    style?: TSpanStyleProps;
}
declare class TSpan extends Displayable<TSpanProps> {
    style: TSpanStyleProps;
    hasStroke(): boolean;
    hasFill(): boolean;
    createStyle(obj?: TSpanStyleProps): TSpanStyleProps;
    setBoundingRect(rect: BoundingRect): void;
    getBoundingRect(): BoundingRect;
    protected static initDefaultProps: void;
}

interface ImageStyleProps extends CommonStyleProps {
    image?: string | ImageLike;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    sx?: number;
    sy?: number;
    sWidth?: number;
    sHeight?: number;
}
interface ImageProps extends DisplayableProps {
    style?: ImageStyleProps;
    onload?: (image: ImageLike) => void;
}
declare class ZRImage extends Displayable<ImageProps> {
    style: ImageStyleProps;
    __image: ImageLike;
    __imageSrc: string;
    onload: (image: ImageLike) => void;
    createStyle(obj?: ImageStyleProps): ImageStyleProps;
    private _getSize;
    getWidth(): number;
    getHeight(): number;
    getAnimationStyleProps(): MapToType<ImageProps, boolean>;
    getBoundingRect(): BoundingRect;
}

declare class RectShape {
    r?: number | number[];
    x: number;
    y: number;
    width: number;
    height: number;
}
interface RectProps extends PathProps {
    shape?: Partial<RectShape>;
}
declare class Rect extends Path<RectProps> {
    shape: RectShape;
    constructor(opts?: RectProps);
    getDefaultShape(): RectShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: RectShape): void;
    isZeroArea(): boolean;
}

interface TextStylePropsPart {
    text?: string;
    fill?: string;
    stroke?: string;
    opacity?: number;
    fillOpacity?: number;
    strokeOpacity?: number;
    lineWidth?: number;
    lineDash?: false | number[];
    lineDashOffset?: number;
    borderDash?: false | number[];
    borderDashOffset?: number;
    font?: string;
    textFont?: string;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
    fontFamily?: string;
    fontSize?: number | string;
    align?: TextAlign;
    verticalAlign?: TextVerticalAlign;
    lineHeight?: number;
    width?: number | string;
    height?: number;
    tag?: string;
    textShadowColor?: string;
    textShadowBlur?: number;
    textShadowOffsetX?: number;
    textShadowOffsetY?: number;
    backgroundColor?: string | {
        image: ImageLike | string;
    };
    padding?: number | number[];
    margin?: number;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number | number[];
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
}
interface TextStyleProps extends TextStylePropsPart {
    text?: string;
    x?: number;
    y?: number;
    width?: number;
    rich?: Dictionary<TextStylePropsPart>;
    overflow?: 'break' | 'breakAll' | 'truncate';
    lineOverflow?: 'truncate';
    ellipsis?: string;
    placeholder?: string;
    truncateMinChar?: number;
}
interface TextProps extends DisplayableProps {
    style?: TextStyleProps;
    zlevel?: number;
    z?: number;
    z2?: number;
    culling?: boolean;
    cursor?: string;
}
declare type TextState = Pick<TextProps, DisplayableStatePropNames> & ElementCommonState;
declare type DefaultTextStyle = Pick<TextStyleProps, 'fill' | 'stroke' | 'align' | 'verticalAlign'> & {
    autoStroke?: boolean;
};
interface ZRText {
    animate(key?: '', loop?: boolean): Animator<this>;
    animate(key: 'style', loop?: boolean): Animator<this['style']>;
    getState(stateName: string): TextState;
    ensureState(stateName: string): TextState;
    states: Dictionary<TextState>;
    stateProxy: (stateName: string) => TextState;
}
declare class ZRText extends Displayable<TextProps> {
    type: string;
    style: TextStyleProps;
    overlap: 'hidden' | 'show' | 'blur';
    attachedTransform: Transformable;
    private _children;
    private _childCursor;
    private _defaultStyle;
    constructor(opts?: TextProps);
    childrenRef(): (TSpan | ZRImage | Rect)[];
    update(): void;
    getComputedTransform(): MatrixArray;
    private _updateSubTexts;
    addSelfToZr(zr: ZRenderType): void;
    removeSelfFromZr(zr: ZRenderType): void;
    getBoundingRect(): BoundingRect;
    setDefaultTextStyle(defaultTextStyle: DefaultTextStyle): void;
    setTextContent(textContent: never): void;
    protected _mergeStyle(targetStyle: TextStyleProps, sourceStyle: TextStyleProps): TextStyleProps;
    private _mergeRich;
    getAnimationStyleProps(): MapToType<TextProps, boolean>;
    private _getOrCreateChild;
    private _updatePlainTexts;
    private _updateRichTexts;
    private _placeToken;
    private _renderBackground;
    static makeFont(style: TextStylePropsPart): string;
}

interface TextPositionCalculationResult {
    x: number;
    y: number;
    align: TextAlign;
    verticalAlign: TextVerticalAlign;
}

declare class PolylineShape {
    points: VectorArray[];
    percent?: number;
    smooth?: number | 'spline';
    smoothConstraint?: VectorArray[];
}
interface PolylineProps extends PathProps {
    shape?: Partial<PolylineShape>;
}
declare class Polyline extends Path<PolylineProps> {
    shape: PolylineShape;
    constructor(opts?: PolylineProps);
    getDefaultStyle(): {
        stroke: string;
        fill: string;
    };
    getDefaultShape(): PolylineShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: PolylineShape): void;
}

interface GroupProps extends ElementProps {
}
declare class Group extends Element<GroupProps> {
    readonly isGroup = true;
    private _children;
    constructor(opts?: GroupProps);
    childrenRef(): Element<ElementProps>[];
    children(): Element<ElementProps>[];
    childAt(idx: number): Element;
    childOfName(name: string): Element;
    childCount(): number;
    add(child: Element): Group;
    addBefore(child: Element, nextSibling: Element): this;
    replaceAt(child: Element, index: number): this;
    _doAdd(child: Element): void;
    remove(child: Element): this;
    removeAll(): this;
    eachChild<Context>(cb: (this: Context, el: Element, index?: number) => void, context?: Context): this;
    traverse<T>(cb: (this: T, el: Element) => boolean | void, context?: T): this;
    addSelfToZr(zr: ZRenderType): void;
    removeSelfFromZr(zr: ZRenderType): void;
    getBoundingRect(includeChildren?: Element[]): BoundingRect;
}

interface ElementAnimateConfig {
    duration?: number;
    delay?: number;
    easing?: AnimationEasing;
    during?: (percent: number) => void;
    done?: Function;
    aborted?: Function;
    scope?: string;
    force?: boolean;
    additive?: boolean;
    setToFinal?: boolean;
}
interface ElementTextConfig {
    position?: BuiltinTextPosition | (number | string)[];
    rotation?: number;
    layoutRect?: RectLike;
    offset?: number[];
    origin?: (number | string)[] | 'center';
    distance?: number;
    local?: boolean;
    insideFill?: string;
    insideStroke?: string;
    outsideFill?: string;
    outsideStroke?: string;
    inside?: boolean;
}
interface ElementTextGuideLineConfig {
    anchor?: Point;
    showAbove?: boolean;
    candidates?: ('left' | 'top' | 'right' | 'bottom')[];
}
interface ElementEvent {
    type: ElementEventName;
    event: ZRRawEvent;
    target: Element;
    topTarget: Element;
    cancelBubble: boolean;
    offsetX: number;
    offsetY: number;
    gestureEvent: string;
    pinchX: number;
    pinchY: number;
    pinchScale: number;
    wheelDelta: number;
    zrByTouch: boolean;
    which: number;
    stop: (this: ElementEvent) => void;
}
declare type ElementEventCallback<Ctx, Impl> = (this: CbThis$1<Ctx, Impl>, e: ElementEvent) => boolean | void;
declare type CbThis$1<Ctx, Impl> = unknown extends Ctx ? Impl : Ctx;
interface ElementEventHandlerProps {
    onclick: ElementEventCallback<unknown, unknown>;
    ondblclick: ElementEventCallback<unknown, unknown>;
    onmouseover: ElementEventCallback<unknown, unknown>;
    onmouseout: ElementEventCallback<unknown, unknown>;
    onmousemove: ElementEventCallback<unknown, unknown>;
    onmousewheel: ElementEventCallback<unknown, unknown>;
    onmousedown: ElementEventCallback<unknown, unknown>;
    onmouseup: ElementEventCallback<unknown, unknown>;
    oncontextmenu: ElementEventCallback<unknown, unknown>;
    ondrag: ElementEventCallback<unknown, unknown>;
    ondragstart: ElementEventCallback<unknown, unknown>;
    ondragend: ElementEventCallback<unknown, unknown>;
    ondragenter: ElementEventCallback<unknown, unknown>;
    ondragleave: ElementEventCallback<unknown, unknown>;
    ondragover: ElementEventCallback<unknown, unknown>;
    ondrop: ElementEventCallback<unknown, unknown>;
}
interface ElementProps extends Partial<ElementEventHandlerProps> {
    name?: string;
    ignore?: boolean;
    isGroup?: boolean;
    draggable?: boolean | 'horizontal' | 'vertical';
    silent?: boolean;
    ignoreClip?: boolean;
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    originX?: number;
    originY?: number;
    rotation?: number;
    globalScaleRatio?: number;
    textConfig?: ElementTextConfig;
    textContent?: ZRText;
    clipPath?: Path;
    drift?: Element['drift'];
    extra?: Dictionary<unknown>;
    anid?: string;
}
declare const PRIMARY_STATES_KEYS: readonly ["x", "y", "scaleX", "scaleY", "originX", "originY", "rotation", "ignore"];
declare type ElementStatePropNames = (typeof PRIMARY_STATES_KEYS)[number] | 'textConfig';
declare type ElementState = Pick<ElementProps, ElementStatePropNames> & ElementCommonState;
declare type ElementCommonState = {
    hoverLayer?: boolean;
};
interface Element<Props extends ElementProps = ElementProps> extends Transformable, Eventful, ElementEventHandlerProps {
    on<Ctx>(event: ElementEventName, handler: ElementEventCallback<Ctx, this>, context?: Ctx): this;
    on<Ctx>(event: string, handler: EventCallback<Ctx, this>, context?: Ctx): this;
    on<Ctx>(event: ElementEventName, query: EventQuery, handler: ElementEventCallback<Ctx, this>, context?: Ctx): this;
    on<Ctx>(event: string, query: EventQuery, handler: EventCallback<Ctx, this>, context?: Ctx): this;
}
declare class Element<Props extends ElementProps = ElementProps> {
    id: number;
    type: string;
    name: string;
    ignore: boolean;
    silent: boolean;
    isGroup: boolean;
    draggable: boolean | 'horizontal' | 'vertical';
    dragging: boolean;
    parent: Group;
    animators: Animator<any>[];
    ignoreClip: boolean;
    __hostTarget: Element;
    __zr: ZRenderType;
    __dirty: number;
    __isRendered: boolean;
    __inHover: boolean;
    private _clipPath?;
    private _textContent?;
    private _textGuide?;
    textConfig?: ElementTextConfig;
    textGuideLineConfig?: ElementTextGuideLineConfig;
    anid: string;
    extra: Dictionary<unknown>;
    currentStates?: string[];
    prevStates?: string[];
    states: Dictionary<ElementState>;
    stateTransition: ElementAnimateConfig;
    stateProxy?: (stateName: string, targetStates?: string[]) => ElementState;
    protected _normalState: ElementState;
    private _innerTextDefaultStyle;
    constructor(props?: Props);
    protected _init(props?: Props): void;
    drift(dx: number, dy: number, e?: ElementEvent): void;
    beforeUpdate(): void;
    afterUpdate(): void;
    update(): void;
    updateInnerText(forceUpdate?: boolean): void;
    protected canBeInsideText(): boolean;
    protected getInsideTextFill(): string;
    protected getInsideTextStroke(textFill: string): string;
    protected getOutsideFill(): "#333" | "#ccc";
    protected getOutsideStroke(textFill: string): string;
    traverse<Context>(cb: (this: Context, el: Element<Props>) => void, context?: Context): void;
    protected attrKV(key: string, value: unknown): void;
    hide(): void;
    show(): void;
    attr(keyOrObj: Props): this;
    attr<T extends keyof Props>(keyOrObj: T, value: Props[T]): this;
    saveCurrentToNormalState(toState: ElementState): void;
    protected _innerSaveToNormal(toState: ElementState): void;
    protected _savePrimaryToNormal(toState: Dictionary<any>, normalState: Dictionary<any>, primaryKeys: readonly string[]): void;
    hasState(): boolean;
    getState(name: string): ElementState;
    ensureState(name: string): ElementState;
    clearStates(noAnimation?: boolean): void;
    useState(stateName: string, keepCurrentStates?: boolean, noAnimation?: boolean): ElementState;
    useStates(states: string[], noAnimation?: boolean): void;
    private _updateAnimationTargets;
    removeState(state: string): void;
    replaceState(oldState: string, newState: string, forceAdd: boolean): void;
    toggleState(state: string, enable: boolean): void;
    protected _mergeStates(states: ElementState[]): ElementState;
    protected _applyStateObj(stateName: string, state: ElementState, normalState: ElementState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
    private _attachComponent;
    private _detachComponent;
    getClipPath(): Path<PathProps>;
    setClipPath(clipPath: Path): void;
    removeClipPath(): void;
    getTextContent(): ZRText;
    setTextContent(textEl: ZRText): void;
    setTextConfig(cfg: ElementTextConfig): void;
    removeTextContent(): void;
    getTextGuideLine(): Polyline;
    setTextGuideLine(guideLine: Polyline): void;
    removeTextGuideLine(): void;
    markRedraw(): void;
    dirty(): void;
    private _toggleHoverLayerFlag;
    addSelfToZr(zr: ZRenderType): void;
    removeSelfFromZr(zr: ZRenderType): void;
    animate(key?: string, loop?: boolean): Animator<any>;
    addAnimator(animator: Animator<any>, key: string): void;
    updateDuringAnimation(key: string): void;
    stopAnimation(scope?: string, forwardToLast?: boolean): this;
    animateTo(target: Props, cfg?: ElementAnimateConfig, animationProps?: MapToType<Props, boolean>): void;
    animateFrom(target: Props, cfg: Omit<ElementAnimateConfig, 'setToFinal'>, animationProps?: MapToType<Props, boolean>): void;
    protected _transitionState(stateName: string, target: Props, cfg?: ElementAnimateConfig, animationProps?: MapToType<Props, boolean>): void;
    getBoundingRect(): BoundingRect;
    getPaintRect(): BoundingRect;
    calculateTextPosition: (out: TextPositionCalculationResult, style: ElementTextConfig, rect: RectLike) => TextPositionCalculationResult;
    static REDARAW_BIT: number;
    protected static initDefaultProps: void;
}

interface CommonStyleProps {
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowColor?: string;
    opacity?: number;
    blend?: string;
}
interface DisplayableProps extends ElementProps {
    style?: Dictionary<any>;
    zlevel?: number;
    z?: number;
    z2?: number;
    culling?: boolean;
    cursor?: string;
    rectHover?: boolean;
    progressive?: boolean;
    incremental?: boolean;
    batch?: boolean;
    invisible?: boolean;
}
declare type DisplayableKey = keyof DisplayableProps;
declare type DisplayablePropertyType = PropType<DisplayableProps, DisplayableKey>;
declare type DisplayableStatePropNames = ElementStatePropNames | 'style' | 'z' | 'z2' | 'invisible';
declare type DisplayableState = Pick<DisplayableProps, DisplayableStatePropNames> & ElementCommonState;
interface Displayable<Props extends DisplayableProps = DisplayableProps> {
    animate(key?: '', loop?: boolean): Animator<this>;
    animate(key: 'style', loop?: boolean): Animator<this['style']>;
    getState(stateName: string): DisplayableState;
    ensureState(stateName: string): DisplayableState;
    states: Dictionary<DisplayableState>;
    stateProxy: (stateName: string) => DisplayableState;
}
declare class Displayable<Props extends DisplayableProps = DisplayableProps> extends Element<Props> {
    invisible: boolean;
    z: number;
    z2: number;
    zlevel: number;
    culling: boolean;
    cursor: string;
    rectHover: boolean;
    incremental: boolean;
    style: Dictionary<any>;
    protected _normalState: DisplayableState;
    protected _rect: BoundingRect;
    protected _paintRect: BoundingRect;
    protected _prevPaintRect: BoundingRect;
    dirtyRectTolerance: number;
    useHoverLayer?: boolean;
    __hoverStyle?: CommonStyleProps;
    __clipPaths?: Path[];
    __canvasFillGradient: CanvasGradient;
    __canvasStrokeGradient: CanvasGradient;
    __canvasFillPattern: CanvasPattern;
    __canvasStrokePattern: CanvasPattern;
    __svgEl: SVGElement;
    constructor(props?: Props);
    protected _init(props?: Props): void;
    beforeBrush(): void;
    afterBrush(): void;
    innerBeforeBrush(): void;
    innerAfterBrush(): void;
    shouldBePainted(viewWidth: number, viewHeight: number, considerClipPath: boolean, considerAncestors: boolean): boolean;
    contain(x: number, y: number): boolean;
    traverse<Context>(cb: (this: Context, el: this) => void, context?: Context): void;
    rectContain(x: number, y: number): boolean;
    getPaintRect(): BoundingRect;
    setPrevPaintRect(paintRect: BoundingRect): void;
    getPrevPaintRect(): BoundingRect;
    animateStyle(loop: boolean): Animator<this["style"]>;
    updateDuringAnimation(targetKey: string): void;
    attrKV(key: DisplayableKey, value: DisplayablePropertyType): void;
    setStyle(obj: Props['style']): this;
    setStyle<T extends keyof Props['style']>(obj: T, value: Props['style'][T]): this;
    dirtyStyle(): void;
    dirty(): void;
    styleChanged(): boolean;
    styleUpdated(): void;
    createStyle(obj?: Props['style']): Props["style"];
    useStyle(obj: Props['style']): void;
    isStyleObject(obj: Props['style']): any;
    protected _innerSaveToNormal(toState: DisplayableState): void;
    protected _applyStateObj(stateName: string, state: DisplayableState, normalState: DisplayableState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
    protected _mergeStates(states: DisplayableState[]): DisplayableState;
    protected _mergeStyle(targetStyle: CommonStyleProps, sourceStyle: CommonStyleProps): CommonStyleProps;
    getAnimationStyleProps(): MapToType<DisplayableProps, boolean>;
    static STYLE_CHANGED_BIT: number;
    protected static initDefaultProps: void;
}

interface PainterBase {
    type: string;
    root: HTMLElement;
    resize(width?: number | string, height?: number | string): void;
    refresh(): void;
    clear(): void;
    getViewportRoot(): HTMLElement;
    getType: () => string;
    getWidth(): number;
    getHeight(): number;
    dispose(): void;
    getViewportRoot: () => HTMLElement;
    getViewportRootOffset: () => {
        offsetLeft: number;
        offsetTop: number;
    };
    refreshHover(): void;
    pathToImage(e: Path, dpr: number): ZRImage;
    configLayer(zlevel: number, config: Dictionary<any>): void;
    setBackgroundColor(backgroundColor: string | GradientObject | PatternObject): void;
}

interface HandlerProxyInterface extends Eventful {
    handler: Handler;
    dispose: () => void;
    setCursor: (cursorStyle?: string) => void;
}

declare function shapeCompareFunc(a: Displayable, b: Displayable): number;
declare class Storage {
    private _roots;
    private _displayList;
    private _displayListLen;
    traverse<T>(cb: (this: T, el: Element) => void, context?: T): void;
    getDisplayList(update?: boolean, includeIgnore?: boolean): Displayable[];
    updateDisplayList(includeIgnore?: boolean): void;
    private _updateAndAddDisplayable;
    addRoot(el: Element): void;
    delRoot(el: Element | Element[]): void;
    delAllRoots(): void;
    getRoots(): Element<ElementProps>[];
    dispose(): void;
    displayableSortFunc: typeof shapeCompareFunc;
}

declare class HoveredResult {
    x: number;
    y: number;
    target: Displayable;
    topTarget: Displayable;
    constructor(x?: number, y?: number);
}
declare type HandlerName = 'click' | 'dblclick' | 'mousewheel' | 'mouseout' | 'mouseup' | 'mousedown' | 'mousemove' | 'contextmenu';
declare class Handler extends Eventful {
    storage: Storage;
    painter: PainterBase;
    painterRoot: HTMLElement;
    proxy: HandlerProxyInterface;
    private _hovered;
    private _gestureMgr;
    private _draggingMgr;
    _downEl: Element;
    _upEl: Element;
    _downPoint: [number, number];
    constructor(storage: Storage, painter: PainterBase, proxy: HandlerProxyInterface, painterRoot: HTMLElement);
    setHandlerProxy(proxy: HandlerProxyInterface): void;
    mousemove(event: ZRRawEvent): void;
    mouseout(event: ZRRawEvent): void;
    resize(): void;
    dispatch(eventName: HandlerName, eventArgs?: any): void;
    dispose(): void;
    setCursorStyle(cursorStyle: string): void;
    dispatchToElement(targetInfo: {
        target?: Element;
        topTarget?: Element;
    }, eventName: ElementEventName, event: ZRRawEvent): void;
    findHover(x: number, y: number, exclude?: Displayable): HoveredResult;
    processGesture(event: ZRRawEvent, stage?: 'start' | 'end' | 'change'): void;
    click: (event: ZRRawEvent) => void;
    mousedown: (event: ZRRawEvent) => void;
    mouseup: (event: ZRRawEvent) => void;
    mousewheel: (event: ZRRawEvent) => void;
    dblclick: (event: ZRRawEvent) => void;
    contextmenu: (event: ZRRawEvent) => void;
}

declare function parseXML(svg: Document | string | SVGElement): SVGElement;

declare type MorphDividingMethod = 'split' | 'duplicate';

interface LayerConfig {
    clearColor?: string | GradientObject | PatternObject;
    motionBlur?: boolean;
    lastFrameAlpha?: number;
}

declare class ZRender {
    dom: HTMLElement;
    id: number;
    storage: Storage;
    painter: PainterBase;
    handler: Handler;
    animation: Animation;
    private _sleepAfterStill;
    private _stillFrameAccum;
    private _needsRefresh;
    private _needsRefreshHover;
    private _darkMode;
    private _backgroundColor;
    constructor(id: number, dom: HTMLElement, opts?: ZRenderInitOpt);
    add(el: Element): void;
    remove(el: Element): void;
    configLayer(zLevel: number, config: LayerConfig): void;
    setBackgroundColor(backgroundColor: string | GradientObject | PatternObject): void;
    getBackgroundColor(): string | GradientObject | PatternObject;
    setDarkMode(darkMode: boolean): void;
    isDarkMode(): boolean;
    refreshImmediately(fromInside?: boolean): void;
    refresh(): void;
    flush(): void;
    private _flush;
    setSleepAfterStill(stillFramesCount: number): void;
    wakeUp(): void;
    addHover(el: Displayable): void;
    removeHover(el: Path | TSpan | ZRImage): void;
    clearHover(): void;
    refreshHover(): void;
    refreshHoverImmediately(): void;
    resize(opts?: {
        width?: number | string;
        height?: number | string;
    }): void;
    clearAnimation(): void;
    getWidth(): number;
    getHeight(): number;
    pathToImage(e: Path, dpr: number): ZRImage;
    setCursorStyle(cursorStyle: string): void;
    findHover(x: number, y: number): {
        target: Displayable;
        topTarget: Displayable;
    };
    on<Ctx>(eventName: ElementEventName, eventHandler: ElementEventCallback<Ctx, unknown>, context?: Ctx): this;
    on<Ctx>(eventName: string, eventHandler: EventCallback<Ctx, unknown>, context?: Ctx): this;
    off(eventName?: string, eventHandler?: EventCallback<unknown, unknown> | EventCallback<unknown, unknown, ElementEvent>): void;
    trigger(eventName: string, event?: unknown): void;
    clear(): void;
    dispose(): void;
}
interface ZRenderInitOpt {
    renderer?: string;
    devicePixelRatio?: number;
    width?: number | string;
    height?: number | string;
    useDirtyRect?: boolean;
}
interface ZRenderType extends ZRender {
}

interface AriaLabelOption {
    enabled?: boolean;
    description?: string;
    general?: {
        withTitle?: string;
        withoutTitle?: string;
    };
    series?: {
        maxCount?: number;
        single?: {
            prefix?: string;
            withName?: string;
            withoutName?: string;
        };
        multiple?: {
            prefix?: string;
            withName?: string;
            withoutName?: string;
            separator?: {
                middle?: string;
                end?: string;
            };
        };
    };
    data?: {
        maxCount?: number;
        allData?: string;
        partialData?: string;
        withName?: string;
        withoutName?: string;
        separator?: {
            middle?: string;
            end?: string;
        };
    };
}
interface AriaOption extends AriaLabelOption {
    enabled?: boolean;
    label?: AriaLabelOption;
    decal?: {
        show?: boolean;
        decals?: DecalObject | DecalObject[];
    };
}

interface RichTextTooltipMarker {
    renderMode: TooltipRenderMode;
    content: string;
    style: Dictionary<unknown>;
}
declare type TooltipMarker = string | RichTextTooltipMarker;

declare type VisualOptionBase = {
    [key in BuiltinVisualProperty]?: any;
};
declare type LabelFormatter = (min: OptionDataValue, max?: OptionDataValue) => string;
interface VisualMapOption<T extends VisualOptionBase = VisualOptionBase> extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
    show?: boolean;
    align?: string;
    realtime?: boolean;
    seriesIndex?: 'all' | number[] | number;
    min?: number;
    max?: number;
    dimension?: number;
    inRange?: T;
    outOfRange?: T;
    controller?: {
        inRange?: T;
        outOfRange?: T;
    };
    target?: {
        inRange?: T;
        outOfRange?: T;
    };
    itemWidth?: number;
    itemHeight?: number;
    inverse?: boolean;
    orient?: 'horizontal' | 'vertical';
    backgroundColor?: ZRColor;
    contentColor?: ZRColor;
    inactiveColor?: ZRColor;
    padding?: number[] | number;
    textGap?: number;
    precision?: number;
    color?: ColorString[];
    formatter?: string | LabelFormatter;
    text?: string[];
    textStyle?: LabelOption;
    categories?: unknown;
}
interface VisualMeta {
    stops: {
        value: number;
        color: ColorString;
    }[];
    outerColors: ColorString[];
    dimension?: number;
}

declare const dataCtors: {
    float: ArrayConstructor | Float64ArrayConstructor;
    int: ArrayConstructor | Int32ArrayConstructor;
    ordinal: ArrayConstructor;
    number: ArrayConstructor;
    time: ArrayConstructor;
};
declare type ListDimensionType = keyof typeof dataCtors;
interface DefaultDataVisual {
    style: PathStyleProps;
    drawType: 'fill' | 'stroke';
    symbol?: string;
    symbolSize?: number | number[];
    symbolRotate?: number;
    symbolKeepAspect?: boolean;
    liftZ?: number;
    legendSymbol?: string;
    visualMeta?: VisualMeta[];
    colorFromPalette?: boolean;
    decal?: DecalObject;
}

declare const AXIS_TYPES: {
    readonly value: 1;
    readonly category: 1;
    readonly time: 1;
    readonly log: 1;
};
declare type OptionAxisType = keyof typeof AXIS_TYPES;
interface AxisBaseOption extends ComponentOption, AnimationOptionMixin {
    type?: OptionAxisType;
    show?: boolean;
    inverse?: boolean;
    name?: string;
    nameLocation?: 'start' | 'middle' | 'end';
    nameRotate?: number;
    nameTruncate?: {
        maxWidth?: number;
        ellipsis?: string;
        placeholder?: string;
    };
    nameTextStyle?: AxisNameTextStyleOption;
    nameGap?: number;
    silent?: boolean;
    triggerEvent?: boolean;
    tooltip?: {
        show?: boolean;
    };
    axisPointer?: any;
    axisLine?: AxisLineOption;
    axisTick?: AxisTickOption;
    axisLabel?: AxisLabelOption;
    minorTick?: MinorTickOption;
    splitLine?: SplitLineOption;
    minorSplitLine?: MinorSplitLineOption;
    splitArea?: SplitAreaOption;
    boundaryGap?: boolean | [number | string, number | string];
    min?: ScaleDataValue | 'dataMin' | ((extent: {
        min: number;
        max: number;
    }) => ScaleDataValue);
    max?: ScaleDataValue | 'dataMax' | ((extent: {
        min: number;
        max: number;
    }) => ScaleDataValue);
    scale?: boolean;
    deduplication?: boolean;
    data?: (OrdinalRawValue | {
        value: OrdinalRawValue;
        textStyle?: TextCommonOption;
    })[];
    splitNumber?: number;
    interval?: number;
    minInterval?: number;
    maxInterval?: number;
    logBase?: number;
}
interface AxisNameTextStyleOption extends TextCommonOption {
    rich?: Dictionary<TextCommonOption>;
}
interface AxisLineOption {
    show?: boolean | 'auto';
    onZero?: boolean;
    onZeroAxisIndex?: number;
    symbol?: string | [string, string];
    symbolSize?: number[];
    symbolOffset?: number[];
    lineStyle?: LineStyleOption;
}
interface AxisTickOption {
    show?: boolean | 'auto';
    inside?: boolean;
    length?: number;
    lineStyle?: LineStyleOption;
    alignWithLabel?: boolean;
    interval?: 'auto' | number | ((index: number, value: string) => boolean);
}
declare type AxisLabelFormatterOption = string | ((value: OrdinalRawValue | number, index: number) => string);
declare type TimeAxisLabelUnitFormatter = AxisLabelFormatterOption | string[];
declare type TimeAxisLabelFormatterOption = string | ((value: number, index: number, extra: {
    level: number;
}) => string) | {
    year?: TimeAxisLabelUnitFormatter;
    month?: TimeAxisLabelUnitFormatter;
    week?: TimeAxisLabelUnitFormatter;
    day?: TimeAxisLabelUnitFormatter;
    hour?: TimeAxisLabelUnitFormatter;
    minute?: TimeAxisLabelUnitFormatter;
    second?: TimeAxisLabelUnitFormatter;
    millisecond?: TimeAxisLabelUnitFormatter;
    inherit?: boolean;
};
interface AxisLabelOption extends Omit<TextCommonOption, 'color'> {
    show?: boolean;
    inside?: boolean;
    rotate?: number;
    showMinLabel?: boolean;
    showMaxLabel?: boolean;
    margin?: number;
    formatter?: AxisLabelFormatterOption | TimeAxisLabelFormatterOption;
    interval?: 'auto' | number | ((index: number, value: string) => boolean);
    color?: ColorString | ((value?: string | number, index?: number) => ColorString);
    rich?: Dictionary<TextCommonOption>;
}
interface MinorTickOption {
    show?: boolean;
    splitNumber?: number;
    length?: number;
    lineStyle?: LineStyleOption;
}
interface SplitLineOption {
    show?: boolean;
    interval?: 'auto' | number | ((index: number, value: string) => boolean);
    lineStyle?: LineStyleOption<ZRColor | ZRColor[]>;
}
interface MinorSplitLineOption {
    show?: boolean;
    lineStyle?: LineStyleOption;
}
interface SplitAreaOption {
    show?: boolean;
    interval?: 'auto' | number | ((index: number, value: string) => boolean);
    areaStyle?: AreaStyleOption<ZRColor[]>;
}

interface BaseBarSeriesOption<StateOption, ExtraStateOption = DefaultExtraStateOpts> extends SeriesOption<StateOption, ExtraStateOption>, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin {
    barMinHeight?: number;
    barMinAngle?: number;
    barMaxWidth?: number;
    barMinWidth?: number;
    barWidth?: number | string;
    barGap?: string | number;
    barCategoryGap?: string | number;
    large?: boolean;
    largeThreshold?: number;
}

interface GridOption extends ComponentOption, BoxLayoutOptionMixin, ShadowOptionMixin {
    show?: boolean;
    containLabel?: boolean;
    backgroundColor?: ZRColor;
    borderWidth?: number;
    borderColor?: ZRColor;
    tooltip?: any;
}

interface AngleAxisOption extends AxisBaseOption {
    polarIndex?: number;
    polarId?: string;
    startAngle?: number;
    clockwise?: boolean;
    splitNumber?: number;
    axisLabel?: Omit<AxisBaseOption['axisLabel'], 'rotate'> & {
        rotate?: AxisBaseOption['axisLabel']['rotate'];
    };
}
interface RadiusAxisOption extends AxisBaseOption {
    polarIndex?: number;
    polarId?: string;
}

interface PolarOption extends ComponentOption, CircleLayoutOptionMixin {
}

declare type BrushType = 'polygon' | 'rect' | 'lineX' | 'lineY';
declare type BrushTypeUncertain = BrushType | false | 'auto';
declare type BrushMode = 'single' | 'multiple';

interface MapStateOption {
    itemStyle?: GeoItemStyleOption;
    label?: SeriesLabelOption;
}
interface MapDataItemOption extends MapStateOption, StatesOptionMixin<MapStateOption>, OptionDataItemObject<OptionDataValueNumeric> {
    cursor?: string;
}
declare type MapValueCalculationType = 'sum' | 'average' | 'min' | 'max';
interface MapSeriesOption extends SeriesOption<MapStateOption>, MapStateOption, GeoCommonOptionMixin, SeriesOnGeoOptionMixin, BoxLayoutOptionMixin, SeriesEncodeOptionMixin {
    type?: 'map';
    coordinateSystem?: string;
    silent?: boolean;
    markLine?: any;
    markPoint?: any;
    markArea?: any;
    mapValueCalculation?: MapValueCalculationType;
    showLegendSymbol?: boolean;
    geoCoord?: Dictionary<number[]>;
    data?: OptionDataValueNumeric[] | OptionDataValueNumeric[][] | MapDataItemOption[];
    nameProperty?: string;
}

interface GeoItemStyleOption extends ItemStyleOption {
    areaColor?: ZRColor;
}
interface GeoLabelOption extends LabelOption {
    formatter?: string | ((params: GeoLabelFormatterDataParams) => string);
}
interface GeoStateOption {
    itemStyle?: GeoItemStyleOption;
    label?: GeoLabelOption;
}
interface GeoLabelFormatterDataParams {
    name: string;
    status: DisplayState;
}
interface RegoinOption extends GeoStateOption, StatesOptionMixin<GeoStateOption> {
    name?: string;
    selected?: boolean;
}
interface GeoCommonOptionMixin extends RoamOptionMixin {
    map: string;
    aspectScale?: number;
    layoutCenter?: (number | string)[];
    layoutSize?: number | string;
    boundingCoords?: number[][];
    nameMap?: NameMap;
}
interface GeoOption extends ComponentOption, BoxLayoutOptionMixin, AnimationOptionMixin, GeoCommonOptionMixin, StatesOptionMixin<GeoStateOption>, GeoStateOption {
    show?: boolean;
    silent?: boolean;
    regions?: RegoinOption[];
    stateAnimation?: AnimationOptionMixin;
    selectedMode?: 'single' | 'multiple' | boolean;
    selectedMap?: Dictionary<boolean>;
}

declare type BrushToolboxIconType = BrushType | 'keep' | 'clear';
interface BrushOption extends ComponentOption, ModelFinderObject {
    toolbox?: BrushToolboxIconType[];
    brushLink?: number[] | 'all' | 'none';
    throttleType?: 'fixRate' | 'debounce';
    throttleDelay?: number;
    inBrush?: VisualOptionFixed;
    outOfBrush?: VisualOptionFixed;
    brushType?: BrushTypeUncertain;
    brushStyle?: {
        borderWidth?: number;
        color?: ZRColor;
        borderColor?: ZRColor;
    };
    transformable?: boolean;
    brushMode?: BrushMode;
    removeOnClick?: boolean;
}

interface BarStateOption {
    itemStyle?: BarItemStyleOption;
    label?: SeriesLabelOption;
}
interface BarItemStyleOption extends ItemStyleOption {
    borderRadius?: number | number[];
}
interface BarDataItemOption extends BarStateOption, StatesOptionMixin<BarStateOption>, OptionDataItemObject<OptionDataValue> {
    cursor?: string;
}
interface BarSeriesOption extends BaseBarSeriesOption<BarStateOption>, BarStateOption, SeriesStackOptionMixin, SeriesSamplingOptionMixin, SeriesEncodeOptionMixin {
    type?: 'bar';
    coordinateSystem?: 'cartesian2d' | 'polar';
    clip?: boolean;
    roundCap?: boolean;
    showBackground?: boolean;
    backgroundStyle?: ItemStyleOption & {
        borderRadius?: number | number[];
    };
    data?: (BarDataItemOption | OptionDataValue | OptionDataValue[])[];
    realtimeSort?: boolean;
}

declare type BarWidthAndOffset = Dictionary<Dictionary<{
    bandWidth: number;
    offset: number;
    offsetCenter: number;
    width: number;
}>>;
interface BarGridLayoutOptionForCustomSeries {
    count: number;
    barWidth?: number;
    barMaxWidth?: number;
    barMinWidth?: number;
    barGap?: number;
    barCategoryGap?: number;
}
declare type BarGridLayoutResult = BarWidthAndOffset[string][string][];

declare type CustomExtraElementInfo = Dictionary<unknown>;
declare const TRANSFORM_PROPS: {
    readonly x: 1;
    readonly y: 1;
    readonly scaleX: 1;
    readonly scaleY: 1;
    readonly originX: 1;
    readonly originY: 1;
    readonly rotation: 1;
};
declare type TransformProp = keyof typeof TRANSFORM_PROPS;
declare type TransitionAnyOption = {
    transition?: TransitionAnyProps;
    enterFrom?: Dictionary<unknown>;
    leaveTo?: Dictionary<unknown>;
};
declare type TransitionAnyProps = string | string[];
declare type TransitionTransformOption = {
    transition?: ElementRootTransitionProp | ElementRootTransitionProp[];
    enterFrom?: Dictionary<unknown>;
    leaveTo?: Dictionary<unknown>;
};
declare type ElementRootTransitionProp = TransformProp | 'shape' | 'extra' | 'style';
declare type ShapeMorphingOption = {
    morph?: boolean;
};
interface CustomBaseElementOption extends Partial<Pick<Element, TransformProp | 'silent' | 'ignore' | 'textConfig'>>, TransitionTransformOption {
    type: string;
    id?: string;
    name?: string;
    info?: CustomExtraElementInfo;
    textContent?: CustomTextOption | false;
    clipPath?: CustomZRPathOption | false;
    extra?: TransitionAnyOption;
    during?(params: typeof customDuringAPI): void;
    focus?: 'none' | 'self' | 'series' | ArrayLike<number>;
    blurScope?: BlurScope;
}
interface CustomDisplayableOption extends CustomBaseElementOption, Partial<Pick<Displayable, 'zlevel' | 'z' | 'z2' | 'invisible'>> {
    style?: ZRStyleProps & TransitionAnyOption;
    styleEmphasis?: ZRStyleProps | false;
    emphasis?: CustomDisplayableOptionOnState;
    blur?: CustomDisplayableOptionOnState;
    select?: CustomDisplayableOptionOnState;
}
interface CustomDisplayableOptionOnState extends Partial<Pick<Displayable, TransformProp | 'textConfig' | 'z2'>> {
    style?: (ZRStyleProps & TransitionAnyOption) | false;
}
interface CustomZRPathOption extends CustomDisplayableOption, ShapeMorphingOption {
    shape?: PathProps['shape'] & TransitionAnyOption;
    style?: CustomDisplayableOption['style'] & {
        decal?: DecalObject;
        __decalPattern?: PatternObject;
    };
}
interface CustomSVGPathOption extends CustomDisplayableOption, ShapeMorphingOption {
    type: 'path';
    shape?: {
        pathData?: string;
        d?: string;
        layout?: 'center' | 'cover';
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    } & TransitionAnyOption;
}
interface CustomImageOption extends CustomDisplayableOption {
    type: 'image';
    style?: ImageStyleProps & TransitionAnyOption;
    emphasis?: CustomImageOptionOnState;
    blur?: CustomImageOptionOnState;
    select?: CustomImageOptionOnState;
}
interface CustomImageOptionOnState extends CustomDisplayableOptionOnState {
    style?: ImageStyleProps & TransitionAnyOption;
}
interface CustomTextOption extends CustomDisplayableOption {
    type: 'text';
}
declare type CustomElementOption = CustomZRPathOption | CustomSVGPathOption | CustomImageOption | CustomTextOption;
interface CustomSeriesRenderItemAPI extends CustomSeriesRenderItemCoordinateSystemAPI {
    getWidth(): number;
    getHeight(): number;
    getZr(): ZRenderType;
    getDevicePixelRatio(): number;
    value(dim: DimensionLoose, dataIndexInside?: number): ParsedValue;
    ordinalRawValue(dim: DimensionLoose, dataIndexInside?: number): ParsedValue | OrdinalRawValue;
    style(userProps?: ZRStyleProps, dataIndexInside?: number): ZRStyleProps;
    styleEmphasis(userProps?: ZRStyleProps, dataIndexInside?: number): ZRStyleProps;
    visual<VT extends NonStyleVisualProps | StyleVisualProps>(visualType: VT, dataIndexInside?: number): VT extends NonStyleVisualProps ? DefaultDataVisual[VT] : VT extends StyleVisualProps ? PathStyleProps[typeof STYLE_VISUAL_TYPE[VT]] : void;
    barLayout(opt: BarGridLayoutOptionForCustomSeries): BarGridLayoutResult;
    currentSeriesIndices(): number[];
    font(opt: Pick<TextCommonOption, 'fontStyle' | 'fontWeight' | 'fontSize' | 'fontFamily'>): string;
}
interface CustomSeriesRenderItemParamsCoordSys {
    type: string;
}
interface CustomSeriesRenderItemCoordinateSystemAPI {
    coord(data: OptionDataValue | OptionDataValue[], clamp?: boolean): number[];
    size?(dataSize: OptionDataValue | OptionDataValue[], dataItem: OptionDataValue | OptionDataValue[]): number | number[];
}
interface CustomSeriesRenderItemParams {
    context: Dictionary<unknown>;
    seriesId: string;
    seriesName: string;
    seriesIndex: number;
    coordSys: CustomSeriesRenderItemParamsCoordSys;
    dataInsideLength: number;
    encode: WrapEncodeDefRet;
}
declare type CustomSeriesRenderItem = (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => CustomElementOption;
interface CustomSeriesOption extends SeriesOption<never>, SeriesEncodeOptionMixin, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnSingleOptionMixin, SeriesOnGeoOptionMixin, SeriesOnCalendarOptionMixin {
    type?: 'custom';
    coordinateSystem?: string | 'none';
    renderItem?: CustomSeriesRenderItem;
    clip?: boolean;
}
declare const STYLE_VISUAL_TYPE: {
    readonly color: "fill";
    readonly borderColor: "stroke";
};
declare type StyleVisualProps = keyof typeof STYLE_VISUAL_TYPE;
declare const NON_STYLE_VISUAL_PROPS: {
    readonly symbol: 1;
    readonly symbolSize: 1;
    readonly symbolKeepAspect: 1;
    readonly legendSymbol: 1;
    readonly visualMeta: 1;
    readonly liftZ: 1;
    readonly decal: 1;
};
declare type NonStyleVisualProps = keyof typeof NON_STYLE_VISUAL_PROPS;
declare const customDuringAPI: {
    setTransform(key: "x" | "y" | "scaleX" | "scaleY" | "originX" | "originY" | "rotation", val: unknown): any;
    getTransform(key: "x" | "y" | "scaleX" | "scaleY" | "originX" | "originY" | "rotation"): unknown;
    setShape(key: string, val: unknown): any;
    getShape(key: string): unknown;
    setStyle(key: string, val: unknown): any;
    getStyle(key: string): unknown;
    setExtra(key: string, val: unknown): any;
    getExtra(key: string): unknown;
};
declare type WrapEncodeDefRet = Dictionary<number[]>;

declare type CartesianAxisPosition = 'top' | 'bottom' | 'left' | 'right';
interface CartesianAxisOption extends AxisBaseOption {
    gridIndex?: number;
    gridId?: string;
    position?: CartesianAxisPosition;
    offset?: number;
    categorySortInfo?: OrdinalSortInfo[];
}

declare type ModelFinderIndexQuery = number | number[] | 'all' | 'none' | false;
declare type ModelFinderIdQuery = OptionId | OptionId[];
declare type ModelFinderNameQuery = OptionId | OptionId[];
declare type ModelFinder = string | ModelFinderObject;
declare type ModelFinderObject = {
    seriesIndex?: ModelFinderIndexQuery;
    seriesId?: ModelFinderIdQuery;
    seriesName?: ModelFinderNameQuery;
    geoIndex?: ModelFinderIndexQuery;
    geoId?: ModelFinderIdQuery;
    geoName?: ModelFinderNameQuery;
    bmapIndex?: ModelFinderIndexQuery;
    bmapId?: ModelFinderIdQuery;
    bmapName?: ModelFinderNameQuery;
    xAxisIndex?: ModelFinderIndexQuery;
    xAxisId?: ModelFinderIdQuery;
    xAxisName?: ModelFinderNameQuery;
    yAxisIndex?: ModelFinderIndexQuery;
    yAxisId?: ModelFinderIdQuery;
    yAxisName?: ModelFinderNameQuery;
    gridIndex?: ModelFinderIndexQuery;
    gridId?: ModelFinderIdQuery;
    gridName?: ModelFinderNameQuery;
    [key: string]: unknown;
};

interface MapperParamAxisInfo {
    axisIndex: number;
    axisName: string;
    axisId: string;
    axisDim: string;
}
interface AxisPointerLink {
    xAxisIndex?: number[] | 'all';
    yAxisIndex?: number[] | 'all';
    xAxisId?: string[];
    yAxisId?: string[];
    xAxisName?: string[] | string;
    yAxisName?: string[] | string;
    radiusAxisIndex?: number[] | 'all';
    angleAxisIndex?: number[] | 'all';
    radiusAxisId?: string[];
    angleAxisId?: string[];
    radiusAxisName?: string[] | string;
    angleAxisName?: string[] | string;
    singleAxisIndex?: number[] | 'all';
    singleAxisId?: string[];
    singleAxisName?: string[] | string;
    mapper?(sourceVal: ScaleDataValue, sourceAxisInfo: MapperParamAxisInfo, targetAxisInfo: MapperParamAxisInfo): CommonAxisPointerOption['value'];
}
interface AxisPointerOption extends ComponentOption, Omit<CommonAxisPointerOption, 'type'> {
    type?: 'line' | 'shadow' | 'cross' | 'none';
    link?: AxisPointerLink[];
}

declare type TopLevelFormatterParams = CallbackDataParams | CallbackDataParams[];
interface TooltipOption extends CommonTooltipOption<TopLevelFormatterParams>, ComponentOption {
    axisPointer?: AxisPointerOption & {
        axis?: 'auto' | 'x' | 'y' | 'angle' | 'radius';
        crossStyle?: LineStyleOption & {
            textStyle?: LabelOption;
        };
    };
    showContent?: boolean;
    trigger?: 'item' | 'axis' | 'none';
    displayMode?: 'single' | 'multipleByCoordSys';
    renderMode?: 'auto' | TooltipRenderMode;
    appendToBody?: boolean;
    className?: string;
    order?: TooltipOrderMode;
}

declare type RendererType = 'canvas' | 'svg';
declare type LayoutOrient = 'vertical' | 'horizontal';
declare type HorizontalAlign = 'left' | 'center' | 'right';
declare type VerticalAlign = 'top' | 'middle' | 'bottom';
declare type ColorString = string;
declare type ZRColor = ColorString | LinearGradientObject | RadialGradientObject | PatternObject;
declare type ZRLineType = 'solid' | 'dotted' | 'dashed' | number | number[];
declare type ZRFontStyle = 'normal' | 'italic' | 'oblique';
declare type ZRFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number;
declare type ZREasing = AnimationEasing;
declare type ZRTextAlign = TextAlign;
declare type ZRTextVerticalAlign = TextVerticalAlign;
declare type ZRStyleProps = PathStyleProps | ImageStyleProps | TSpanStyleProps | TextStyleProps;
declare type ComponentMainType = keyof ECUnitOption & string;
interface PayloadItem {
    excludeSeriesId?: OptionId | OptionId[];
    animation?: PayloadAnimationPart;
    [other: string]: any;
}
interface Payload extends PayloadItem {
    type: string;
    escapeConnect?: boolean;
    batch?: PayloadItem[];
}
interface PayloadAnimationPart {
    duration?: number;
    easing?: AnimationEasing;
    delay?: number;
}
interface ECEvent extends ECEventData {
    type: string;
    componentType?: string;
    componentIndex?: number;
    seriesIndex?: number;
    escapeConnect?: boolean;
    event?: ElementEvent;
    batch?: ECEventData;
}
interface ECEventData {
    [key: string]: any;
}
declare type TooltipRenderMode = 'html' | 'richText';
declare type TooltipOrderMode = 'valueAsc' | 'valueDesc' | 'seriesAsc' | 'seriesDesc';
declare type OrdinalRawValue = string | number;
declare type OrdinalNumber = number;
declare type OrdinalSortInfo = {
    ordinalNumber: OrdinalNumber;
    beforeSortIndex: number;
};
declare type ParsedValue = ParsedValueNumeric | OrdinalRawValue;
declare type ParsedValueNumeric = number | OrdinalNumber;
declare type ScaleDataValue = ParsedValueNumeric | OrdinalRawValue | Date;
declare type DimensionIndex = number;
declare type DimensionIndexLoose = DimensionIndex | string;
declare type DimensionName = string;
declare type DimensionLoose = DimensionName | DimensionIndexLoose;
declare type DimensionDefinition = {
    type?: ListDimensionType;
    name?: DimensionName;
    displayName?: string;
};
declare type DimensionDefinitionLoose = DimensionDefinition['name'] | DimensionDefinition;
declare const SERIES_LAYOUT_BY_COLUMN: "column";
declare const SERIES_LAYOUT_BY_ROW: "row";
declare type SeriesLayoutBy = typeof SERIES_LAYOUT_BY_COLUMN | typeof SERIES_LAYOUT_BY_ROW;
declare type OptionSourceHeader = boolean | 'auto' | number;
declare type SeriesDataType = 'main' | 'node' | 'edge';
declare type ECUnitOption = {
    baseOption?: unknown;
    options?: unknown;
    media?: unknown;
    timeline?: ComponentOption | ComponentOption[];
    backgroundColor?: ZRColor;
    darkMode?: boolean | 'auto';
    textStyle?: Pick<LabelOption, 'color' | 'fontStyle' | 'fontWeight' | 'fontSize' | 'fontFamily'>;
    useUTC?: boolean;
    [key: string]: ComponentOption | ComponentOption[] | Dictionary<unknown> | unknown;
    stateAnimation?: AnimationOption$1;
} & AnimationOptionMixin & ColorPaletteOptionMixin & AriaOptionMixin;
interface ECOption extends ECUnitOption {
    baseOption?: ECUnitOption;
    timeline?: ComponentOption | ComponentOption[];
    options?: ECUnitOption[];
    media?: MediaUnit[];
}
declare type OptionDataItemObject<T> = {
    id?: OptionId;
    name?: OptionName;
    value?: T[] | T;
    selected?: boolean;
};
declare type OptionId = string | number;
declare type OptionName = string | number;
interface GraphEdgeItemObject<VAL extends OptionDataValue> extends OptionDataItemObject<VAL> {
    source?: string | number;
    target?: string | number;
}
declare type OptionDataValue = string | number | Date;
declare type OptionDataValueNumeric = number | '-';
declare type OptionDataValueDate = Date | string | number;
declare type ThemeOption = Dictionary<any>;
declare type DisplayState = 'normal' | 'emphasis' | 'blur' | 'select';
interface OptionEncodeVisualDimensions {
    tooltip?: OptionEncodeValue;
    label?: OptionEncodeValue;
    itemName?: OptionEncodeValue;
    itemId?: OptionEncodeValue;
    seriesName?: OptionEncodeValue;
}
interface OptionEncode extends OptionEncodeVisualDimensions {
    [coordDim: string]: OptionEncodeValue;
}
declare type OptionEncodeValue = DimensionLoose | DimensionLoose[];
interface CallbackDataParams {
    componentType: string;
    componentSubType: string;
    componentIndex: number;
    seriesType?: string;
    seriesIndex?: number;
    seriesId?: string;
    seriesName?: string;
    name: string;
    dataIndex: number;
    data: any;
    dataType?: SeriesDataType;
    value: any;
    color?: ZRColor;
    borderColor?: string;
    dimensionNames?: DimensionName[];
    encode?: DimensionUserOuputEncode;
    marker?: TooltipMarker;
    status?: DisplayState;
    dimensionIndex?: number;
    percent?: number;
    $vars: string[];
}
declare type DimensionUserOuputEncode = {
    [coordOrVisualDimName: string]: DimensionIndex[];
};
declare type DecalDashArrayX = number | (number | number[])[];
declare type DecalDashArrayY = number | number[];
interface DecalObject {
    symbol?: string | (string | string[]);
    symbolSize?: number;
    symbolKeepAspect?: boolean;
    color?: string;
    backgroundColor?: string;
    dashArrayX?: DecalDashArrayX;
    dashArrayY?: DecalDashArrayY;
    rotation?: number;
    maxTileWidth?: number;
    maxTileHeight?: number;
}
interface MediaQuery {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    minAspectRatio?: number;
    maxAspectRatio?: number;
}
declare type MediaUnit = {
    query?: MediaQuery;
    option: ECUnitOption;
};
interface ColorPaletteOptionMixin {
    color?: ZRColor | ZRColor[];
    colorLayer?: ZRColor[][];
}
interface AriaOptionMixin {
    aria?: AriaOption;
}
interface BoxLayoutOptionMixin {
    width?: number | string;
    height?: number | string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
}
interface CircleLayoutOptionMixin {
    center?: (number | string)[];
    radius?: (number | string)[] | number | string;
}
interface ShadowOptionMixin {
    shadowBlur?: number;
    shadowColor?: ColorString;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
}
interface BorderOptionMixin {
    borderColor?: string;
    borderWidth?: number;
    borderType?: ZRLineType;
    borderCap?: CanvasLineCap;
    borderJoin?: CanvasLineJoin;
    borderDashOffset?: number;
    borderMiterLimit?: number;
}
declare type AnimationDelayCallbackParam = {
    count: number;
    index: number;
};
declare type AnimationDurationCallback = (idx: number) => number;
declare type AnimationDelayCallback = (idx: number, params?: AnimationDelayCallbackParam) => number;
interface AnimationOption$1 {
    duration?: number;
    easing?: AnimationEasing;
    delay?: number;
}
interface AnimationOptionMixin {
    animation?: boolean;
    animationThreshold?: number;
    animationDuration?: number | AnimationDurationCallback;
    animationEasing?: AnimationEasing;
    animationDelay?: number | AnimationDelayCallback;
    animationDurationUpdate?: number | AnimationDurationCallback;
    animationEasingUpdate?: AnimationEasing;
    animationDelayUpdate?: number | AnimationDelayCallback;
}
interface RoamOptionMixin {
    roam?: boolean | 'pan' | 'move' | 'zoom' | 'scale';
    center?: number[];
    zoom?: number;
    scaleLimit?: {
        min?: number;
        max?: number;
    };
}
declare type SymbolSizeCallback<T> = (rawValue: any, params: T) => number | number[];
declare type SymbolCallback<T> = (rawValue: any, params: T) => string;
declare type SymbolRotateCallback<T> = (rawValue: any, params: T) => number;
interface SymbolOptionMixin<T = unknown> {
    symbol?: string | (unknown extends T ? never : SymbolCallback<T>);
    symbolSize?: number | number[] | (unknown extends T ? never : SymbolSizeCallback<T>);
    symbolRotate?: number | (unknown extends T ? never : SymbolRotateCallback<T>);
    symbolKeepAspect?: boolean;
    symbolOffset?: (string | number)[];
}
interface ItemStyleOption extends ShadowOptionMixin, BorderOptionMixin {
    color?: ZRColor;
    opacity?: number;
    decal?: DecalObject | 'none';
}
interface LineStyleOption<Clr = ZRColor> extends ShadowOptionMixin {
    width?: number;
    color?: Clr;
    opacity?: number;
    type?: ZRLineType;
    cap?: CanvasLineCap;
    join?: CanvasLineJoin;
    dashOffset?: number;
    miterLimit?: number;
}
interface AreaStyleOption<Clr = ZRColor> extends ShadowOptionMixin {
    color?: Clr;
    opacity?: number;
}
interface VisualOptionUnit {
    symbol?: string;
    symbolSize?: number;
    color?: ColorString;
    colorAlpha?: number;
    opacity?: number;
    colorLightness?: number;
    colorSaturation?: number;
    colorHue?: number;
    decal?: DecalObject;
    liftZ?: number;
}
declare type VisualOptionFixed = VisualOptionUnit;
declare type VisualOptionPiecewise = VisualOptionUnit;
declare type BuiltinVisualProperty = keyof VisualOptionUnit;
interface TextCommonOption extends ShadowOptionMixin {
    color?: string;
    fontStyle?: ZRFontStyle;
    fontWeight?: ZRFontWeight;
    fontFamily?: string;
    fontSize?: number | string;
    align?: HorizontalAlign;
    verticalAlign?: VerticalAlign;
    baseline?: VerticalAlign;
    opacity?: number;
    lineHeight?: number;
    backgroundColor?: ColorString | {
        image: ImageLike | string;
    };
    borderColor?: string;
    borderWidth?: number;
    borderType?: ZRLineType;
    borderDashOffset?: number;
    borderRadius?: number | number[];
    padding?: number | number[];
    width?: number | string;
    height?: number;
    textBorderColor?: string;
    textBorderWidth?: number;
    textBorderType?: ZRLineType;
    textBorderDashOffset?: number;
    textShadowBlur?: number;
    textShadowColor?: string;
    textShadowOffsetX?: number;
    textShadowOffsetY?: number;
    tag?: string;
}
interface LabelFormatterCallback<T = CallbackDataParams> {
    (params: T): string;
}
interface LabelOption extends TextCommonOption {
    show?: boolean;
    position?: ElementTextConfig['position'];
    distance?: number;
    rotate?: number;
    offset?: number[];
    minMargin?: number;
    overflow?: TextStyleProps['overflow'];
    silent?: boolean;
    precision?: number | 'auto';
    valueAnimation?: boolean;
    rich?: Dictionary<TextCommonOption>;
}
interface SeriesLabelOption extends LabelOption {
    formatter?: string | LabelFormatterCallback<CallbackDataParams>;
}
interface LineLabelOption extends Omit<LabelOption, 'distance' | 'position'> {
    position?: 'start' | 'middle' | 'end' | 'insideStart' | 'insideStartTop' | 'insideStartBottom' | 'insideMiddle' | 'insideMiddleTop' | 'insideMiddleBottom' | 'insideEnd' | 'insideEndTop' | 'insideEndBottom' | 'insideMiddleBottom';
    distance?: number | number[];
}
interface LabelLineOption {
    show?: boolean;
    showAbove?: boolean;
    length?: number;
    length2?: number;
    smooth?: boolean | number;
    minTurnAngle?: number;
    lineStyle?: LineStyleOption;
}
interface SeriesLineLabelOption extends LineLabelOption {
    formatter?: string | LabelFormatterCallback<CallbackDataParams>;
}
interface LabelLayoutOptionCallbackParams {
    dataIndex?: number;
    dataType?: SeriesDataType;
    seriesIndex: number;
    text: string;
    align: ZRTextAlign;
    verticalAlign: ZRTextVerticalAlign;
    rect: RectLike;
    labelRect: RectLike;
    labelLinePoints?: number[][];
}
interface LabelLayoutOption {
    moveOverlap?: 'shiftX' | 'shiftY' | 'shuffleX' | 'shuffleY';
    hideOverlap?: boolean;
    draggable?: boolean;
    x?: number | string;
    y?: number | string;
    dx?: number;
    dy?: number;
    rotate?: number;
    align?: ZRTextAlign;
    verticalAlign?: ZRTextVerticalAlign;
    width?: number;
    height?: number;
    fontSize?: number;
    labelLinePoints?: number[][];
}
declare type LabelLayoutOptionCallback = (params: LabelLayoutOptionCallbackParams) => LabelLayoutOption;
interface TooltipFormatterCallback<T> {
    (params: T, asyncTicket: string): string | HTMLElement[];
    (params: T, asyncTicket: string, callback: (cbTicket: string, htmlOrDomNodes: string | HTMLElement[]) => void): string | HTMLElement[];
}
declare type TooltipBuiltinPosition = 'inside' | 'top' | 'left' | 'right' | 'bottom';
declare type TooltipBoxLayoutOption = Pick<BoxLayoutOptionMixin, 'top' | 'left' | 'right' | 'bottom'>;
interface PositionCallback {
    (point: [number, number], params: CallbackDataParams | CallbackDataParams[], el: HTMLDivElement | ZRText | null, rect: RectLike | null, size: {
        contentSize: [number, number];
        viewSize: [number, number];
    }): number[] | string[] | TooltipBuiltinPosition | TooltipBoxLayoutOption;
}
interface CommonTooltipOption<FormatterParams> {
    show?: boolean;
    triggerOn?: 'mousemove' | 'click' | 'none' | 'mousemove|click';
    alwaysShowContent?: boolean;
    formatter?: string | TooltipFormatterCallback<FormatterParams>;
    position?: (number | string)[] | TooltipBuiltinPosition | PositionCallback | TooltipBoxLayoutOption;
    confine?: boolean;
    align?: HorizontalAlign;
    verticalAlign?: VerticalAlign;
    showDelay?: number;
    hideDelay?: number;
    transitionDuration?: number;
    enterable?: boolean;
    backgroundColor?: ColorString;
    borderColor?: ColorString;
    borderRadius?: number;
    borderWidth?: number;
    shadowBlur?: number;
    shadowColor?: string;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    padding?: number | number[];
    extraCssText?: string;
    textStyle?: Pick<LabelOption, 'color' | 'fontStyle' | 'fontWeight' | 'fontFamily' | 'fontSize' | 'lineHeight' | 'width' | 'height' | 'textBorderColor' | 'textBorderWidth' | 'textShadowColor' | 'textShadowBlur' | 'textShadowOffsetX' | 'textShadowOffsetY' | 'align'> & {
        decoration?: string;
    };
}
declare type SeriesTooltipOption = CommonTooltipOption<CallbackDataParams> & {
    trigger?: 'item' | 'axis' | boolean | 'none';
};
declare type LabelFormatterParams = {
    value: ScaleDataValue;
    axisDimension: string;
    axisIndex: number;
    seriesData: CallbackDataParams[];
};
interface CommonAxisPointerOption {
    show?: boolean | 'auto';
    z?: number;
    zlevel?: number;
    triggerOn?: 'click' | 'mousemove' | 'none' | 'mousemove|click';
    type?: 'line' | 'shadow' | 'none';
    snap?: boolean;
    triggerTooltip?: boolean;
    value?: ScaleDataValue;
    status?: 'show' | 'hide';
    label?: LabelOption & {
        precision?: 'auto' | number;
        margin?: number;
        formatter?: string | ((params: LabelFormatterParams) => string);
    };
    animation?: boolean | 'auto';
    animationDurationUpdate?: number;
    animationEasingUpdate?: ZREasing;
    lineStyle?: LineStyleOption;
    shadowStyle?: AreaStyleOption;
    handle?: {
        show?: boolean;
        icon?: string;
        size?: number | number[];
        margin?: number;
        color?: ColorString;
        throttle?: number;
    } & ShadowOptionMixin;
    seriesDataIndices?: {
        seriesIndex: number;
        dataIndex: number;
        dataIndexInside: number;
    }[];
}
interface ComponentOption {
    type?: string;
    id?: OptionId;
    name?: OptionName;
    z?: number;
    zlevel?: number;
}
declare type BlurScope = 'coordinateSystem' | 'series' | 'global';
interface DefaultExtraStateOpts {
    emphasis: any;
    select: any;
    blur: any;
}
interface DefaultExtraEmpasisState {
    focus?: 'none' | 'self' | 'series';
}
interface ExtraStateOptsBase {
    emphasis?: {
        focus?: string;
    };
    select?: any;
    blur?: any;
}
interface StatesOptionMixin<StateOption, ExtraStateOpts extends ExtraStateOptsBase = DefaultExtraStateOpts> {
    emphasis?: StateOption & ExtraStateOpts['emphasis'] & {
        blurScope?: BlurScope;
    };
    select?: StateOption & ExtraStateOpts['select'];
    blur?: StateOption & ExtraStateOpts['blur'];
}
interface SeriesOption<StateOption = any, ExtraStateOpts extends ExtraStateOptsBase = DefaultExtraStateOpts> extends ComponentOption, AnimationOptionMixin, ColorPaletteOptionMixin, StatesOptionMixin<StateOption, ExtraStateOpts> {
    silent?: boolean;
    blendMode?: string;
    cursor?: string;
    data?: unknown;
    legendHoverLink?: boolean;
    progressive?: number | false;
    progressiveThreshold?: number;
    progressiveChunkMode?: 'mod';
    coordinateSystem?: string;
    hoverLayerThreshold?: number;
    seriesLayoutBy?: 'column' | 'row';
    labelLine?: LabelLineOption;
    labelLayout?: LabelLayoutOption | LabelLayoutOptionCallback;
    stateAnimation?: AnimationOption$1;
    selectedMap?: Dictionary<boolean>;
    selectedMode?: 'single' | 'multiple' | boolean;
}
interface SeriesOnCartesianOptionMixin {
    xAxisIndex?: number;
    yAxisIndex?: number;
    xAxisId?: string;
    yAxisId?: string;
}
interface SeriesOnPolarOptionMixin {
    radiusAxisIndex?: number;
    angleAxisIndex?: number;
    radiusAxisId?: string;
    angleAxisId?: string;
}
interface SeriesOnSingleOptionMixin {
    singleAxisIndex?: number;
    singleAxisId?: string;
}
interface SeriesOnGeoOptionMixin {
    geoIndex?: number;
    geoId?: string;
}
interface SeriesOnCalendarOptionMixin {
    calendarIndex?: number;
    calendarId?: string;
}
interface SeriesLargeOptionMixin {
    large?: boolean;
    largeThreshold?: number;
}
interface SeriesStackOptionMixin {
    stack?: string;
}
declare type SamplingFunc = (frame: ArrayLike<number>) => number;
interface SeriesSamplingOptionMixin {
    sampling?: 'none' | 'average' | 'min' | 'max' | 'sum' | 'lttb' | SamplingFunc;
}
interface SeriesEncodeOptionMixin {
    datasetIndex?: number;
    datasetId?: string | number;
    seriesLayoutBy?: SeriesLayoutBy;
    sourceHeader?: OptionSourceHeader;
    dimensions?: DimensionDefinitionLoose[];
    encode?: OptionEncode;
}

declare const _default: {
    time: {
        month: string[];
        monthAbbr: string[];
        dayOfWeek: string[];
        dayOfWeekAbbr: string[];
    };
    legend: {
        selector: {
            all: string;
            inverse: string;
        };
    };
    toolbox: {
        brush: {
            title: {
                rect: string;
                polygon: string;
                lineX: string;
                lineY: string;
                keep: string;
                clear: string;
            };
        };
        dataView: {
            title: string;
            lang: string[];
        };
        dataZoom: {
            title: {
                zoom: string;
                back: string;
            };
        };
        magicType: {
            title: {
                line: string;
                bar: string;
                stack: string;
                tiled: string;
            };
        };
        restore: {
            title: string;
        };
        saveAsImage: {
            title: string;
            lang: string[];
        };
    };
    series: {
        typeNames: {
            pie: string;
            bar: string;
            line: string;
            scatter: string;
            effectScatter: string;
            radar: string;
            tree: string;
            treemap: string;
            boxplot: string;
            candlestick: string;
            k: string;
            heatmap: string;
            map: string;
            parallel: string;
            lines: string;
            graph: string;
            sankey: string;
            funnel: string;
            gauge: string;
            pictorialBar: string;
            themeRiver: string;
            sunburst: string;
        };
    };
    aria: {
        general: {
            withTitle: string;
            withoutTitle: string;
        };
        series: {
            single: {
                prefix: string;
                withName: string;
                withoutName: string;
            };
            multiple: {
                prefix: string;
                withName: string;
                withoutName: string;
                separator: {
                    middle: string;
                    end: string;
                };
            };
        };
        data: {
            allData: string;
            partialData: string;
            withName: string;
            withoutName: string;
            separator: {
                middle: string;
                end: string;
            };
        };
    };
};

declare type LocaleOption = typeof _default;
declare function registerLocale(locale: string, localeObj: LocaleOption): void;

interface GlobalModelSetOptionOpts {
    replaceMerge: ComponentMainType | ComponentMainType[];
}

declare type SVGMapSource = 'string' | Document | SVGElement;
declare type GeoJSONMapSource = 'string' | GeoJSON | GeoJSONCompressed;
declare type MapInputObject = {
    geoJSON?: GeoJSONMapSource;
    geoJson?: GeoJSONMapSource;
    svg?: SVGMapSource;
    specialAreas?: GeoSpecialAreas;
};
declare type MapRecord = GeoJSONMapRecord | SVGMapRecord;
interface GeoJSONMapRecord {
    type: 'geoJSON';
    source: GeoJSONMapSource;
    specialAreas: GeoSpecialAreas;
    geoJSON: GeoJSON | GeoJSONCompressed;
}
interface SVGMapRecord {
    type: 'svg';
    source: SVGMapSource;
    specialAreas: GeoSpecialAreas;
    svgXML: ReturnType<typeof parseXML>;
}
declare const _default$1: {
    registerMap: (mapName: string, rawDef: "string" | GeoJSON | GeoJSONCompressed | MapInputObject | MapRecord[], rawSpecialAreas?: GeoSpecialAreas) => MapRecord[];
    retrieveMap: (mapName: string) => MapRecord[];
};

declare type SingleAxisPosition = 'top' | 'bottom' | 'left' | 'right';
interface SingleAxisOption extends AxisBaseOption, BoxLayoutOptionMixin {
    position?: SingleAxisPosition;
    orient?: LayoutOrient;
}

declare type ParallelLayoutDirection = 'horizontal' | 'vertical';
interface ParallelCoordinateSystemOption extends ComponentOption, BoxLayoutOptionMixin {
    layout?: ParallelLayoutDirection;
    axisExpandable?: boolean;
    axisExpandCenter?: number;
    axisExpandCount?: number;
    axisExpandWidth?: number;
    axisExpandTriggerOn?: 'click' | 'mousemove';
    axisExpandRate?: number;
    axisExpandDebounce?: number;
    axisExpandSlideTriggerArea?: [number, number, number];
    axisExpandWindow?: number[];
    parallelAxisDefault?: ParallelAxisOption;
}

interface ParallelAxisOption extends AxisBaseOption {
    dim?: number | number[];
    parallelIndex?: number;
    areaSelectStyle?: {
        width?: number;
        borderWidth?: number;
        borderColor?: ZRColor;
        color?: ZRColor;
        opacity?: number;
    };
    realtime?: boolean;
}

interface CalendarMonthLabelFormatterCallbackParams {
    nameMap: string;
    yyyy: string;
    yy: string;
    MM: string;
    M: number;
}
interface CalendarYearLabelFormatterCallbackParams {
    nameMap: string;
    start: string;
    end: string;
}
interface CalendarOption extends ComponentOption, BoxLayoutOptionMixin {
    cellSize?: number | 'auto' | (number | 'auto')[];
    orient?: LayoutOrient;
    splitLine?: {
        show?: boolean;
        lineStyle?: LineStyleOption;
    };
    itemStyle?: ItemStyleOption;
    range?: OptionDataValueDate | (OptionDataValueDate)[];
    dayLabel?: Omit<LabelOption, 'position'> & {
        firstDay?: number;
        margin?: number | string;
        position?: 'start' | 'end';
        nameMap?: 'en' | 'cn' | string[];
    };
    monthLabel?: Omit<LabelOption, 'position'> & {
        margin?: number;
        position?: 'start' | 'end';
        nameMap?: 'en' | 'cn' | string[];
        formatter?: string | ((params: CalendarMonthLabelFormatterCallbackParams) => string);
    };
    yearLabel?: Omit<LabelOption, 'position'> & {
        margin?: number;
        position?: 'top' | 'bottom' | 'left' | 'right';
        formatter?: string | ((params: CalendarYearLabelFormatterCallbackParams) => string);
    };
}

declare type IconStyle = ItemStyleOption & {
    textFill?: LabelOption['color'];
    textBackgroundColor?: LabelOption['backgroundColor'];
    textPosition?: LabelOption['position'];
    textAlign?: LabelOption['align'];
    textBorderRadius?: LabelOption['borderRadius'];
    textPadding?: LabelOption['padding'];
};
interface ToolboxFeatureOption {
    show?: boolean;
    title?: string | Dictionary<string>;
    icon?: string | Dictionary<string>;
    iconStyle?: IconStyle;
    emphasis?: {
        iconStyle?: IconStyle;
    };
    iconStatus?: Dictionary<DisplayState>;
    onclick?: () => void;
}

interface ToolboxTooltipFormatterParams {
    componentType: 'toolbox';
    name: string;
    title: string;
    $vars: ['name', 'title'];
}
interface ToolboxOption extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
    show?: boolean;
    orient?: LayoutOrient;
    backgroundColor?: ZRColor;
    borderRadius?: number | number[];
    padding?: number | number[];
    itemSize?: number;
    itemGap?: number;
    showTitle?: boolean;
    iconStyle?: ItemStyleOption;
    emphasis?: {
        iconStyle?: ItemStyleOption;
    };
    textStyle?: LabelOption;
    tooltip?: CommonTooltipOption<ToolboxTooltipFormatterParams>;
    feature?: Dictionary<ToolboxFeatureOption>;
}

interface TitleOption extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
    show?: boolean;
    type?: 'title';
    text?: string;
    link?: string;
    target?: 'self' | 'blank';
    subtext?: string;
    sublink?: string;
    subtarget?: 'self' | 'blank';
    textAlign?: ZRTextAlign;
    textVerticalAlign?: ZRTextVerticalAlign;
    textBaseline?: ZRTextVerticalAlign;
    backgroundColor?: ZRColor;
    padding?: number | number[];
    itemGap?: number;
    textStyle?: LabelOption;
    subtextStyle?: LabelOption;
    triggerEvent?: boolean;
    borderRadius?: number | number[];
}

interface TimelineControlStyle extends ItemStyleOption {
    show?: boolean;
    showPlayBtn?: boolean;
    showPrevBtn?: boolean;
    showNextBtn?: boolean;
    itemSize?: number;
    itemGap?: number;
    position?: 'left' | 'right' | 'top' | 'bottom';
    playIcon?: string;
    stopIcon?: string;
    prevIcon?: string;
    nextIcon?: string;
    playBtnSize?: number | string;
    stopBtnSize?: number | string;
    nextBtnSize?: number | string;
    prevBtnSize?: number | string;
}
interface TimelineCheckpointStyle extends ItemStyleOption, SymbolOptionMixin {
    animation?: boolean;
    animationDuration?: number;
    animationEasing?: ZREasing;
}
interface TimelineLineStyleOption extends LineStyleOption {
    show?: boolean;
}
interface TimelineLabelOption extends Omit<LabelOption, 'position'> {
    show?: boolean;
    position?: 'auto' | 'left' | 'right' | 'top' | 'bottom' | number;
    interval?: 'auto' | number;
    formatter?: string | ((value: string | number, index: number) => string);
}
interface TimelineDataItemOption extends SymbolOptionMixin {
    value?: OptionDataValue;
    itemStyle?: ItemStyleOption;
    label?: TimelineLabelOption;
    checkpointStyle?: TimelineCheckpointStyle;
    emphasis?: {
        itemStyle?: ItemStyleOption;
        label?: TimelineLabelOption;
        checkpointStyle?: TimelineCheckpointStyle;
    };
    progress?: {
        lineStyle?: TimelineLineStyleOption;
        itemStyle?: ItemStyleOption;
        label?: TimelineLabelOption;
    };
    tooltip?: boolean;
}
interface TimelineOption extends ComponentOption, BoxLayoutOptionMixin, SymbolOptionMixin {
    backgroundColor?: ZRColor;
    borderColor?: ColorString;
    borderWidth?: number;
    tooltip?: CommonTooltipOption<CallbackDataParams> & {
        trigger?: 'item';
    };
    show?: boolean;
    axisType?: 'category' | 'time' | 'value';
    currentIndex?: number;
    autoPlay?: boolean;
    rewind?: boolean;
    loop?: boolean;
    playInterval?: number;
    realtime?: boolean;
    controlPosition?: 'left' | 'right' | 'top' | 'bottom';
    padding?: number | number[];
    orient?: LayoutOrient;
    inverse?: boolean;
    replaceMerge?: GlobalModelSetOptionOpts['replaceMerge'];
    lineStyle?: TimelineLineStyleOption;
    itemStyle?: ItemStyleOption;
    checkpointStyle?: TimelineCheckpointStyle;
    controlStyle?: TimelineControlStyle;
    label?: TimelineLabelOption;
    emphasis?: {
        lineStyle?: TimelineLineStyleOption;
        itemStyle?: ItemStyleOption;
        checkpointStyle?: TimelineCheckpointStyle;
        controlStyle?: TimelineControlStyle;
        label?: TimelineLabelOption;
    };
    progress?: {
        lineStyle?: TimelineLineStyleOption;
        itemStyle?: ItemStyleOption;
        label?: TimelineLabelOption;
    };
    data?: (OptionDataValue | TimelineDataItemOption)[];
}

interface SliderTimelineOption extends TimelineOption {
}

declare type SelectorType = 'all' | 'inverse';
interface LegendSelectorButtonOption {
    type?: SelectorType;
    title?: string;
}
interface DataItem {
    name?: string;
    icon?: string;
    textStyle?: LabelOption;
    tooltip?: unknown;
}
interface LegendTooltipFormatterParams {
    componentType: 'legend';
    legendIndex: number;
    name: string;
    $vars: ['name'];
}
interface LegendOption extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
    show?: boolean;
    orient?: LayoutOrient;
    align?: 'auto' | 'left' | 'right';
    backgroundColor?: ColorString;
    borderRadius?: number | number[];
    padding?: number | number[];
    itemGap?: number;
    itemWidth?: number;
    itemHeight?: number;
    inactiveColor?: ColorString;
    inactiveBorderColor?: ColorString;
    itemStyle?: ItemStyleOption;
    formatter?: string | ((name: string) => string);
    textStyle?: LabelOption;
    selectedMode?: boolean | 'single' | 'multiple';
    selected?: Dictionary<boolean>;
    selector?: (LegendSelectorButtonOption | SelectorType)[] | boolean;
    selectorLabel?: LabelOption;
    emphasis?: {
        selectorLabel?: LabelOption;
    };
    selectorPosition?: 'auto' | 'start' | 'end';
    selectorItemGap?: number;
    selectorButtonGap?: number;
    data?: (string | DataItem)[];
    symbolKeepAspect?: boolean;
    tooltip?: CommonTooltipOption<LegendTooltipFormatterParams>;
}

interface ScrollableLegendOption extends LegendOption {
    scrollDataIndex?: number;
    pageButtonItemGap?: number;
    pageButtonGap?: number;
    pageButtonPosition?: 'start' | 'end';
    pageFormatter?: string | ((param: {
        current: number;
        total: number;
    }) => string);
    pageIcons?: {
        horizontal?: string[];
        vertical?: string[];
    };
    pageIconColor?: ZRColor;
    pageIconInactiveColor?: ZRColor;
    pageIconSize?: number;
    pageTextStyle?: LabelOption;
    animationDurationUpdate?: number;
}

interface DataZoomOption extends ComponentOption {
    orient?: LayoutOrient;
    xAxisIndex?: number | number[];
    xAxisId?: string | string[];
    yAxisIndex?: number | number[];
    yAxisId?: string | string[];
    radiusAxisIndex?: number | number[];
    radiusAxisId?: string | string[];
    angleAxisIndex?: number | number[];
    angleAxisId?: string | string[];
    singleAxisIndex?: number | number[];
    singleAxisId?: string | string[];
    filterMode?: 'filter' | 'weakFilter' | 'empty' | 'none';
    throttle?: number | null | undefined;
    start?: number;
    end?: number;
    startValue?: number;
    endValue?: number;
    minSpan?: number;
    maxSpan?: number;
    minValueSpan?: number;
    maxValueSpan?: number;
    rangeMode?: ['value' | 'percent', 'value' | 'percent'];
    realtime?: boolean;
    textStyle?: LabelOption;
}

interface SliderDataZoomOption extends DataZoomOption, BoxLayoutOptionMixin {
    show?: boolean;
    backgroundColor?: ZRColor;
    borderColor?: ZRColor;
    borderRadius?: number | number[];
    dataBackground?: {
        lineStyle?: LineStyleOption;
        areaStyle?: AreaStyleOption;
    };
    selectedDataBackground?: {
        lineStyle?: LineStyleOption;
        areaStyle?: AreaStyleOption;
    };
    fillerColor?: ZRColor;
    handleIcon?: string;
    handleSize?: string | number;
    handleStyle?: ItemStyleOption;
    moveHandleIcon?: string;
    moveHandleStyle?: ItemStyleOption;
    moveHandleSize?: number;
    labelPrecision?: number | 'auto';
    labelFormatter?: string | ((value: number, valueStr: string) => string);
    showDetail?: boolean;
    showDataShadow?: 'auto' | boolean;
    zoomLock?: boolean;
    textStyle?: LabelOption;
    brushSelect?: boolean;
    brushStyle?: ItemStyleOption;
    emphasis?: {
        handleStyle?: ItemStyleOption;
        moveHandleStyle?: ItemStyleOption;
    };
}

interface InsideDataZoomOption extends DataZoomOption {
    disabled?: boolean;
    zoomLock?: boolean;
    zoomOnMouseWheel?: boolean | 'shift' | 'ctrl' | 'alt';
    moveOnMouseMove?: boolean | 'shift' | 'ctrl' | 'alt';
    moveOnMouseWheel?: boolean | 'shift' | 'ctrl' | 'alt';
    preventDefaultMouseMove?: boolean;
    textStyle?: never;
}

interface ContinousVisualMapOption extends VisualMapOption {
    align?: 'auto' | 'left' | 'right' | 'top' | 'bottom';
    calculable?: boolean;
    range?: number[];
    hoverLink?: boolean;
    hoverLinkDataSize?: number;
    hoverLinkOnHandle?: boolean;
    handleIcon?: string;
    handleSize?: string | number;
    handleStyle?: ItemStyleOption;
    indicatorIcon?: string;
    indicatorSize?: string | number;
    indicatorStyle?: ItemStyleOption;
    emphasis?: {
        handleStyle?: ItemStyleOption;
    };
}

interface VisualPiece extends VisualOptionPiecewise {
    min?: number;
    max?: number;
    lt?: number;
    gt?: number;
    lte?: number;
    gte?: number;
    value?: number;
    label?: string;
}
interface PiecewiseVisualMapOption extends VisualMapOption {
    align?: 'auto' | 'left' | 'right';
    minOpen?: boolean;
    maxOpen?: boolean;
    itemWidth?: number;
    itemHeight?: number;
    itemSymbol?: string;
    pieces?: VisualPiece[];
    categories?: string[];
    splitNumber?: number;
    selected?: Dictionary<boolean>;
    selectedMode?: 'multiple' | 'single';
    showLabel?: boolean;
    itemGap?: number;
    hoverLink?: boolean;
}

declare type LineDataValue = OptionDataValue | OptionDataValue[];
interface ExtraStateOption {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
    };
}
interface LineStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface LineDataItemOption extends SymbolOptionMixin, LineStateOption, StatesOptionMixin<LineStateOption, ExtraStateOption> {
    name?: string;
    value?: LineDataValue;
}
interface LineEndLabelOption extends SeriesLabelOption {
    valueAnimation: boolean;
}
interface LineSeriesOption extends SeriesOption<LineStateOption, ExtraStateOption & {
    emphasis?: {
        lineStyle?: LineStyleOption | {
            width?: 'bolder';
        };
        areaStyle?: AreaStyleOption;
    };
    blur?: {
        lineStyle?: LineStyleOption;
        areaStyle?: AreaStyleOption;
    };
}>, LineStateOption, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesStackOptionMixin, SeriesSamplingOptionMixin, SymbolOptionMixin<CallbackDataParams>, SeriesEncodeOptionMixin {
    type?: 'line';
    coordinateSystem?: 'cartesian2d' | 'polar';
    clip?: boolean;
    label?: SeriesLabelOption;
    endLabel?: LineEndLabelOption;
    lineStyle?: LineStyleOption;
    areaStyle?: AreaStyleOption & {
        origin?: 'auto' | 'start' | 'end';
    };
    step?: false | 'start' | 'end' | 'middle';
    smooth?: boolean;
    smoothMonotone?: 'x' | 'y' | 'none';
    connectNulls?: boolean;
    showSymbol?: boolean;
    showAllSymbol?: 'auto';
    data?: (LineDataValue | LineDataItemOption)[];
}

interface ScatterStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface ExtraStateOption$1 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
    };
}
interface ScatterDataItemOption extends SymbolOptionMixin, ScatterStateOption, StatesOptionMixin<ScatterStateOption, ExtraStateOption$1>, OptionDataItemObject<OptionDataValue> {
}
interface ScatterSeriesOption extends SeriesOption<ScatterStateOption, ExtraStateOption$1>, ScatterStateOption, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, SeriesLargeOptionMixin, SeriesStackOptionMixin, SymbolOptionMixin<CallbackDataParams>, SeriesEncodeOptionMixin {
    type?: 'scatter';
    coordinateSystem?: string;
    cursor?: string;
    clip?: boolean;
    data?: (ScatterDataItemOption | OptionDataValue | OptionDataValue[])[] | ArrayLike<number>;
}

interface PieItemStyleOption extends ItemStyleOption {
    borderRadius?: (number | string)[] | number | string;
}
interface PieStateOption {
    itemStyle?: PieItemStyleOption;
    label?: PieLabelOption;
    labelLine?: PieLabelLineOption;
}
interface PieLabelOption extends Omit<SeriesLabelOption, 'rotate' | 'position'> {
    rotate?: number;
    alignTo?: 'none' | 'labelLine' | 'edge';
    edgeDistance?: string | number;
    bleedMargin?: number;
    distanceToLabelLine?: number;
    position?: SeriesLabelOption['position'] | 'outer' | 'inner' | 'center';
}
interface PieLabelLineOption extends LabelLineOption {
    maxSurfaceAngle?: number;
}
interface ExtraStateOption$2 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
        scaleSize?: number;
    };
}
interface PieDataItemOption extends OptionDataItemObject<OptionDataValueNumeric>, PieStateOption, StatesOptionMixin<PieStateOption, ExtraStateOption$2> {
    cursor?: string;
}
interface PieSeriesOption extends Omit<SeriesOption<PieStateOption, ExtraStateOption$2>, 'labelLine'>, PieStateOption, CircleLayoutOptionMixin, BoxLayoutOptionMixin, SeriesEncodeOptionMixin {
    type?: 'pie';
    roseType?: 'radius' | 'area';
    clockwise?: boolean;
    startAngle?: number;
    minAngle?: number;
    minShowLabelAngle?: number;
    selectedOffset?: number;
    avoidLabelOverlap?: boolean;
    percentPrecision?: number;
    stillShowZeroSum?: boolean;
    animationType?: 'expansion' | 'scale';
    animationTypeUpdate?: 'transition' | 'expansion';
    data?: OptionDataValueNumeric[] | OptionDataValueNumeric[][] | PieDataItemOption[];
}

declare type RadarSeriesDataValue = OptionDataValue[];
interface RadarSeriesStateOption {
    lineStyle?: LineStyleOption;
    areaStyle?: AreaStyleOption;
    label?: SeriesLabelOption;
    itemStyle?: ItemStyleOption;
}
interface RadarSeriesDataItemOption extends SymbolOptionMixin, RadarSeriesStateOption, StatesOptionMixin<RadarSeriesStateOption>, OptionDataItemObject<RadarSeriesDataValue> {
}
interface RadarSeriesOption extends SeriesOption<RadarSeriesStateOption>, RadarSeriesStateOption, SymbolOptionMixin<CallbackDataParams>, SeriesEncodeOptionMixin {
    type?: 'radar';
    coordinateSystem?: 'radar';
    radarIndex?: number;
    radarId?: string;
    data?: (RadarSeriesDataItemOption | RadarSeriesDataValue)[];
}

interface CurveLineStyleOption extends LineStyleOption {
    curveness?: number;
}
interface TreeSeriesStateOption {
    itemStyle?: ItemStyleOption;
    lineStyle?: CurveLineStyleOption;
    label?: SeriesLabelOption;
}
interface ExtraStateOption$3 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'] | 'ancestor' | 'descendant';
        scale?: boolean;
    };
}
interface TreeSeriesNodeItemOption extends SymbolOptionMixin<CallbackDataParams>, TreeSeriesStateOption, StatesOptionMixin<TreeSeriesStateOption, ExtraStateOption$3>, OptionDataItemObject<OptionDataValue> {
    children?: TreeSeriesNodeItemOption[];
    collapsed?: boolean;
    link?: string;
    target?: string;
}
interface TreeSeriesLeavesOption extends TreeSeriesStateOption, StatesOptionMixin<TreeSeriesStateOption> {
}
interface TreeSeriesOption extends SeriesOption<TreeSeriesStateOption, ExtraStateOption$3>, TreeSeriesStateOption, SymbolOptionMixin, BoxLayoutOptionMixin, RoamOptionMixin {
    type?: 'tree';
    layout?: 'orthogonal' | 'radial';
    edgeShape?: 'polyline' | 'curve';
    edgeForkPosition?: string | number;
    nodeScaleRatio?: number;
    orient?: 'LR' | 'TB' | 'RL' | 'BT' | 'horizontal' | 'vertical';
    expandAndCollapse?: boolean;
    initialTreeDepth?: number;
    leaves?: TreeSeriesLeavesOption;
    data?: TreeSeriesNodeItemOption[];
}

declare type TreemapSeriesDataValue = number | number[];
interface BreadcrumbItemStyleOption extends ItemStyleOption {
    textStyle?: LabelOption;
}
interface TreemapSeriesLabelOption extends SeriesLabelOption {
    ellipsis?: boolean;
    formatter?: string | ((params: CallbackDataParams) => string);
}
interface TreemapSeriesItemStyleOption extends ItemStyleOption {
    borderRadius?: number | number[];
    colorAlpha?: number;
    colorSaturation?: number;
    borderColorSaturation?: number;
    gapWidth?: number;
}
interface ExtraStateOption$4 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'] | 'descendant' | 'ancestor';
    };
}
interface TreemapStateOption {
    itemStyle?: TreemapSeriesItemStyleOption;
    label?: TreemapSeriesLabelOption;
    upperLabel?: TreemapSeriesLabelOption;
}
interface TreemapSeriesVisualOption {
    visualDimension?: number | string;
    colorMappingBy?: 'value' | 'index' | 'id';
    visualMin?: number;
    visualMax?: number;
    colorAlpha?: number[] | 'none';
    colorSaturation?: number[] | 'none';
    visibleMin?: number;
    childrenVisibleMin?: number;
}
interface TreemapSeriesLevelOption extends TreemapSeriesVisualOption, TreemapStateOption, StatesOptionMixin<TreemapStateOption, ExtraStateOption$4> {
    color?: ColorString[] | 'none';
    decal?: DecalObject[] | 'none';
}
interface TreemapSeriesNodeItemOption extends TreemapSeriesVisualOption, TreemapStateOption, StatesOptionMixin<TreemapStateOption, ExtraStateOption$4> {
    id?: OptionId;
    name?: OptionName;
    value?: TreemapSeriesDataValue;
    children?: TreemapSeriesNodeItemOption[];
    color?: ColorString[] | 'none';
    decal?: DecalObject[] | 'none';
}
interface TreemapSeriesOption extends SeriesOption<TreemapStateOption, ExtraStateOption$4>, TreemapStateOption, BoxLayoutOptionMixin, RoamOptionMixin, TreemapSeriesVisualOption {
    type?: 'treemap';
    size?: (number | string)[];
    sort?: boolean | 'asc' | 'desc';
    clipWindow?: 'origin' | 'fullscreen';
    squareRatio?: number;
    leafDepth?: number;
    drillDownIcon?: string;
    zoomToNodeRatio?: number;
    nodeClick?: 'zoomToNode' | 'link';
    breadcrumb?: BoxLayoutOptionMixin & {
        show?: boolean;
        height?: number;
        emptyItemWidth: number;
        itemStyle?: BreadcrumbItemStyleOption;
        emphasis?: {
            itemStyle?: BreadcrumbItemStyleOption;
        };
    };
    levels?: TreemapSeriesLevelOption[];
    data?: TreemapSeriesNodeItemOption[];
}

declare type GraphDataValue = OptionDataValue | OptionDataValue[];
interface GraphEdgeLineStyleOption extends LineStyleOption {
    curveness?: number;
}
interface GraphNodeStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface ExtraEmphasisState {
    focus?: DefaultExtraEmpasisState['focus'] | 'adjacency';
}
interface ExtraNodeStateOption {
    emphasis?: ExtraEmphasisState;
}
interface ExtraEdgeStateOption {
    emphasis?: ExtraEmphasisState;
}
interface GraphNodeItemOption extends SymbolOptionMixin, GraphNodeStateOption, GraphNodeStateOption, StatesOptionMixin<GraphNodeStateOption, ExtraNodeStateOption> {
    id?: string;
    name?: string;
    value?: GraphDataValue;
    x?: number;
    y?: number;
    fixed?: boolean;
    category?: number | string;
    draggable?: boolean;
}
interface GraphEdgeStateOption {
    lineStyle?: GraphEdgeLineStyleOption;
    label?: SeriesLineLabelOption;
}
interface GraphEdgeItemOption extends GraphEdgeStateOption, StatesOptionMixin<GraphEdgeStateOption, ExtraEdgeStateOption>, GraphEdgeItemObject<OptionDataValueNumeric> {
    value?: number;
    symbol?: string | string[];
    symbolSize?: number | number[];
    ignoreForceLayout?: boolean;
}
interface GraphCategoryItemOption extends SymbolOptionMixin, GraphNodeStateOption, StatesOptionMixin<GraphNodeStateOption> {
    name?: string;
    value?: OptionDataValue;
}
interface GraphSeriesOption extends SeriesOption, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, SymbolOptionMixin<CallbackDataParams>, RoamOptionMixin, BoxLayoutOptionMixin {
    type?: 'graph';
    coordinateSystem?: string;
    legendHoverLink?: boolean;
    layout?: 'none' | 'force' | 'circular';
    data?: (GraphNodeItemOption | GraphDataValue)[];
    nodes?: (GraphNodeItemOption | GraphDataValue)[];
    edges?: GraphEdgeItemOption[];
    links?: GraphEdgeItemOption[];
    categories?: GraphCategoryItemOption[];
    focusNodeAdjacency?: boolean;
    nodeScaleRatio?: 0.6;
    draggable?: boolean;
    edgeSymbol?: string | string[];
    edgeSymbolSize?: number | number[];
    edgeLabel?: SeriesLineLabelOption;
    label?: SeriesLabelOption;
    itemStyle?: ItemStyleOption;
    lineStyle?: GraphEdgeLineStyleOption;
    emphasis?: {
        focus?: GraphNodeItemOption['emphasis']['focus'];
        scale?: boolean;
        label?: SeriesLabelOption;
        edgeLabel?: SeriesLabelOption;
        itemStyle?: ItemStyleOption;
        lineStyle?: LineStyleOption;
    };
    blur?: {
        label?: SeriesLabelOption;
        edgeLabel?: SeriesLabelOption;
        itemStyle?: ItemStyleOption;
        lineStyle?: LineStyleOption;
    };
    select?: {
        label?: SeriesLabelOption;
        edgeLabel?: SeriesLabelOption;
        itemStyle?: ItemStyleOption;
        lineStyle?: LineStyleOption;
    };
    circular?: {
        rotateLabel?: boolean;
    };
    force?: {
        initLayout?: 'circular' | 'none';
        repulsion?: number | number[];
        gravity?: number;
        friction?: number;
        edgeLength?: number | number[];
        layoutAnimation?: boolean;
    };
}

declare type GaugeColorStop = [number, ColorString];
interface LabelFormatter$1 {
    (value: number): string;
}
interface PointerOption {
    icon?: string;
    show?: boolean;
    keepAspect?: boolean;
    itemStyle?: ItemStyleOption;
    offsetCenter?: (number | string)[];
    length?: number | string;
    width?: number;
}
interface AnchorOption {
    show?: boolean;
    showAbove?: boolean;
    size?: number;
    icon?: string;
    offsetCenter?: (number | string)[];
    keepAspect?: boolean;
    itemStyle?: ItemStyleOption;
}
interface ProgressOption {
    show?: boolean;
    overlap?: boolean;
    width?: number;
    roundCap?: boolean;
    clip?: boolean;
    itemStyle?: ItemStyleOption;
}
interface TitleOption$1 extends LabelOption {
    offsetCenter?: (number | string)[];
    formatter?: LabelFormatter$1 | string;
    valueAnimation?: boolean;
}
interface DetailOption extends LabelOption {
    offsetCenter?: (number | string)[];
    formatter?: LabelFormatter$1 | string;
    valueAnimation?: boolean;
}
interface GaugeStateOption {
    itemStyle?: ItemStyleOption;
}
interface GaugeDataItemOption extends GaugeStateOption, StatesOptionMixin<GaugeStateOption> {
    name?: string;
    value?: OptionDataValueNumeric;
    pointer?: PointerOption;
    progress?: ProgressOption;
    title?: TitleOption$1;
    detail?: DetailOption;
}
interface GaugeSeriesOption extends SeriesOption<GaugeStateOption>, GaugeStateOption, CircleLayoutOptionMixin, SeriesEncodeOptionMixin {
    type?: 'gauge';
    radius?: number | string;
    startAngle?: number;
    endAngle?: number;
    clockwise?: boolean;
    min?: number;
    max?: number;
    splitNumber?: number;
    itemStyle?: ItemStyleOption;
    axisLine?: {
        show?: boolean;
        roundCap?: boolean;
        lineStyle?: Omit<LineStyleOption, 'color'> & {
            color: GaugeColorStop[];
        };
    };
    progress?: ProgressOption;
    splitLine?: {
        show?: boolean;
        length?: number;
        distance?: number;
        lineStyle?: LineStyleOption;
    };
    axisTick?: {
        show?: boolean;
        splitNumber?: number;
        length?: number | string;
        distance?: number;
        lineStyle?: LineStyleOption;
    };
    axisLabel?: LabelOption & {
        formatter?: LabelFormatter$1 | string;
    };
    pointer?: PointerOption;
    anchor?: AnchorOption;
    title?: TitleOption$1;
    detail?: DetailOption;
    data?: (OptionDataValueNumeric | GaugeDataItemOption)[];
}

declare type FunnelLabelOption = Omit<SeriesLabelOption, 'position'> & {
    position?: LabelOption['position'] | 'outer' | 'inner' | 'center' | 'rightTop' | 'rightBottom' | 'leftTop' | 'leftBottom';
};
interface FunnelStateOption {
    itemStyle?: ItemStyleOption;
    label?: FunnelLabelOption;
    labelLine?: LabelLineOption;
}
interface FunnelDataItemOption extends FunnelStateOption, StatesOptionMixin<FunnelStateOption>, OptionDataItemObject<OptionDataValueNumeric> {
    itemStyle?: ItemStyleOption & {
        width?: number | string;
        height?: number | string;
    };
}
interface FunnelSeriesOption extends SeriesOption<FunnelStateOption>, FunnelStateOption, BoxLayoutOptionMixin, SeriesEncodeOptionMixin {
    type?: 'funnel';
    min?: number;
    max?: number;
    minSize?: number | string;
    maxSize?: number | string;
    sort?: 'ascending' | 'descending' | 'none';
    orient?: LayoutOrient;
    gap?: number;
    funnelAlign?: HorizontalAlign | VerticalAlign;
    data?: (OptionDataValueNumeric | OptionDataValueNumeric[] | FunnelDataItemOption)[];
}

declare type ParallelSeriesDataValue = OptionDataValue[];
interface ParallelStateOption {
    lineStyle?: LineStyleOption;
    label?: SeriesLabelOption;
}
interface ParallelSeriesDataItemOption extends ParallelStateOption, StatesOptionMixin<ParallelStateOption> {
    value?: ParallelSeriesDataValue[];
}
interface ParallelSeriesOption extends SeriesOption<ParallelStateOption>, ParallelStateOption, SeriesEncodeOptionMixin {
    type?: 'parallel';
    coordinateSystem?: string;
    parallelIndex?: number;
    parallelId?: string;
    inactiveOpacity?: number;
    activeOpacity?: number;
    smooth?: boolean | number;
    realtime?: boolean;
    tooltip?: SeriesTooltipOption;
    parallelAxisDefault?: ParallelAxisOption;
    emphasis?: {
        label?: SeriesLabelOption;
        lineStyle?: LineStyleOption;
    };
    data?: (ParallelSeriesDataValue | ParallelSeriesDataItemOption)[];
}

declare type FocusNodeAdjacency = boolean | 'inEdges' | 'outEdges' | 'allEdges';
interface SankeyNodeStateOption {
    label?: SeriesLabelOption;
    itemStyle?: ItemStyleOption;
}
interface SankeyEdgeStateOption {
    lineStyle?: SankeyEdgeStyleOption;
}
interface SankeyBothStateOption extends SankeyNodeStateOption, SankeyEdgeStateOption {
}
interface SankeyEdgeStyleOption extends LineStyleOption {
    curveness?: number;
}
interface ExtraStateOption$5 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'] | 'adjacency';
    };
}
interface SankeyNodeItemOption extends SankeyNodeStateOption, StatesOptionMixin<SankeyNodeStateOption, ExtraStateOption$5>, OptionDataItemObject<OptionDataValue> {
    id?: string;
    localX?: number;
    localY?: number;
    depth?: number;
    draggable?: boolean;
    focusNodeAdjacency?: FocusNodeAdjacency;
}
interface SankeyEdgeItemOption extends SankeyEdgeStateOption, StatesOptionMixin<SankeyEdgeStateOption, ExtraStateOption$5>, GraphEdgeItemObject<OptionDataValueNumeric> {
    focusNodeAdjacency?: FocusNodeAdjacency;
}
interface SankeyLevelOption extends SankeyNodeStateOption, SankeyEdgeStateOption {
    depth: number;
}
interface SankeySeriesOption extends SeriesOption<SankeyBothStateOption, ExtraStateOption$5>, SankeyBothStateOption, BoxLayoutOptionMixin {
    type?: 'sankey';
    color?: ColorString[];
    coordinateSystem?: 'view';
    orient?: LayoutOrient;
    nodeWidth?: number;
    nodeGap?: number;
    draggable?: boolean;
    focusNodeAdjacency?: FocusNodeAdjacency;
    layoutIterations?: number;
    nodeAlign?: 'justify' | 'left' | 'right';
    data?: SankeyNodeItemOption[];
    nodes?: SankeyNodeItemOption[];
    edges?: SankeyEdgeItemOption[];
    links?: SankeyEdgeItemOption[];
    levels?: SankeyLevelOption[];
}

declare type BoxplotDataValue = OptionDataValueNumeric[];
interface BoxplotStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface BoxplotDataItemOption extends BoxplotStateOption, StatesOptionMixin<BoxplotStateOption, ExtraStateOption$6> {
    value: BoxplotDataValue;
}
interface ExtraStateOption$6 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
    };
}
interface BoxplotSeriesOption extends SeriesOption<BoxplotStateOption, ExtraStateOption$6>, BoxplotStateOption, SeriesOnCartesianOptionMixin, SeriesEncodeOptionMixin {
    type?: 'boxplot';
    coordinateSystem?: 'cartesian2d';
    layout?: LayoutOrient;
    boxWidth?: (string | number)[];
    data?: (BoxplotDataValue | BoxplotDataItemOption)[];
}

declare type CandlestickDataValue = OptionDataValueNumeric[];
interface CandlestickItemStyleOption extends ItemStyleOption {
    color0?: ZRColor;
    borderColor0?: ColorString;
}
interface CandlestickStateOption {
    itemStyle?: CandlestickItemStyleOption;
    label?: SeriesLabelOption;
}
interface CandlestickDataItemOption extends CandlestickStateOption, StatesOptionMixin<CandlestickStateOption, ExtraStateOption$7> {
    value: CandlestickDataValue;
}
interface ExtraStateOption$7 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
    };
}
interface CandlestickSeriesOption extends SeriesOption<CandlestickStateOption, ExtraStateOption$7>, CandlestickStateOption, SeriesOnCartesianOptionMixin, SeriesLargeOptionMixin, SeriesEncodeOptionMixin {
    type?: 'candlestick';
    coordinateSystem?: 'cartesian2d';
    layout?: LayoutOrient;
    clip?: boolean;
    barMaxWidth?: number | string;
    barMinWidth?: number | string;
    barWidth?: number | string;
    data?: (CandlestickDataValue | CandlestickDataItemOption)[];
}

interface RippleEffectOption {
    period?: number;
    scale?: number;
    brushType?: 'fill' | 'stroke';
    color?: ZRColor;
}
interface SymbolDrawStateOption {
    itemStyle?: ItemStyleOption;
    label?: LabelOption;
}
interface SymbolDrawItemModelOption extends SymbolOptionMixin<object>, StatesOptionMixin<SymbolDrawStateOption, {
    emphasis?: {
        focus?: string;
        scale?: boolean;
    };
}>, SymbolDrawStateOption {
    cursor?: string;
    rippleEffect?: RippleEffectOption;
}

declare type ScatterDataValue = OptionDataValue | OptionDataValue[];
interface EffectScatterStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface EffectScatterDataItemOption extends SymbolOptionMixin, EffectScatterStateOption, StatesOptionMixin<EffectScatterStateOption> {
    name?: string;
    value?: ScatterDataValue;
    rippleEffect?: SymbolDrawItemModelOption['rippleEffect'];
}
interface EffectScatterSeriesOption extends SeriesOption<EffectScatterStateOption>, EffectScatterStateOption, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, SymbolOptionMixin<CallbackDataParams>, SeriesEncodeOptionMixin {
    type?: 'effectScatter';
    coordinateSystem?: string;
    effectType?: 'ripple';
    showEffectOn?: 'render' | 'emphasis';
    rippleEffect?: SymbolDrawItemModelOption['rippleEffect'];
    data?: (EffectScatterDataItemOption | ScatterDataValue)[];
}

interface LineDrawStateOption {
    lineStyle?: LineStyleOption;
    label?: LineLabelOption;
}
interface LineDrawModelOption extends LineDrawStateOption, StatesOptionMixin<LineDrawStateOption> {
    effect?: {
        show?: boolean;
        period?: number;
        delay?: number | ((idx: number) => number);
        constantSpeed?: number;
        symbol?: string;
        symbolSize?: number | number[];
        loop?: boolean;
        trailLength?: number;
        color?: ColorString;
    };
}

declare type LinesCoords = number[][];
declare type LinesValue = OptionDataValue | OptionDataValue[];
interface LinesLineStyleOption extends LineStyleOption {
    curveness?: number;
}
interface LinesStateOption {
    lineStyle?: LinesLineStyleOption;
    label?: SeriesLineLabelOption;
}
interface LinesDataItemOption extends LinesStateOption, StatesOptionMixin<LinesStateOption> {
    name?: string;
    fromName?: string;
    toName?: string;
    symbol?: string[] | string;
    symbolSize?: number[] | number;
    coords?: LinesCoords;
    value?: LinesValue;
}
interface LinesSeriesOption extends SeriesOption<LinesStateOption>, LinesStateOption, SeriesOnCartesianOptionMixin, SeriesOnGeoOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesLargeOptionMixin {
    type?: 'lines';
    coordinateSystem?: string;
    symbol?: string[] | string;
    symbolSize?: number[] | number;
    effect?: LineDrawModelOption['effect'];
    polyline?: boolean;
    clip?: boolean;
    data?: LinesDataItemOption[] | ArrayLike<number>;
}

declare type HeatmapDataValue = OptionDataValue[];
interface HeatmapStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface HeatmapDataItemOption extends HeatmapStateOption, StatesOptionMixin<HeatmapStateOption> {
    value: HeatmapDataValue;
}
interface HeatmapSeriesOption extends SeriesOption<HeatmapStateOption>, HeatmapStateOption, SeriesOnCartesianOptionMixin, SeriesOnGeoOptionMixin, SeriesOnCalendarOptionMixin, SeriesEncodeOptionMixin {
    type?: 'heatmap';
    coordinateSystem?: 'cartesian2d' | 'geo' | 'calendar';
    blurSize?: number;
    pointSize?: number;
    maxOpacity?: number;
    minOpacity?: number;
    data?: (HeatmapDataItemOption | HeatmapDataValue)[];
}

interface PictorialBarStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface PictorialBarSeriesSymbolOption {
    symbol?: string;
    symbolSize?: (number | string)[] | number | string;
    symbolRotate?: number;
    symbolPosition?: 'start' | 'end' | 'center';
    symbolOffset?: (number | string)[] | number | string;
    symbolMargin?: (number | string)[] | number | string;
    symbolRepeat?: boolean | number | 'fixed';
    symbolRepeatDirection?: 'start' | 'end';
    symbolClip?: boolean;
    symbolBoundingData?: number | number[];
    symbolPatternSize?: number;
}
interface ExtraStateOption$8 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
    };
}
interface PictorialBarDataItemOption extends PictorialBarSeriesSymbolOption, AnimationOptionMixin, PictorialBarStateOption, StatesOptionMixin<PictorialBarStateOption, ExtraStateOption$8>, OptionDataItemObject<OptionDataValue> {
    z?: number;
    cursor?: string;
}
interface PictorialBarSeriesOption extends BaseBarSeriesOption<PictorialBarStateOption, ExtraStateOption$8>, PictorialBarStateOption, PictorialBarSeriesSymbolOption, SeriesStackOptionMixin {
    type?: 'pictorialBar';
    coordinateSystem?: 'cartesian2d';
    data?: (PictorialBarDataItemOption | OptionDataValue | OptionDataValue[])[];
}

interface ThemeRiverSeriesLabelOption extends SeriesLabelOption {
    margin?: number;
}
declare type ThemerRiverDataItem = [OptionDataValueDate, OptionDataValueNumeric, string];
interface ThemeRiverStateOption {
    label?: ThemeRiverSeriesLabelOption;
    itemStyle?: ItemStyleOption;
}
interface ThemeRiverSeriesOption extends SeriesOption<ThemeRiverStateOption>, ThemeRiverStateOption, SeriesOnSingleOptionMixin, BoxLayoutOptionMixin {
    type?: 'themeRiver';
    color?: ZRColor[];
    coordinateSystem?: 'singleAxis';
    boundaryGap?: (string | number)[];
    data?: ThemerRiverDataItem[];
}

interface SunburstItemStyleOption extends ItemStyleOption {
    borderRadius?: (number | string)[] | number | string;
}
interface SunburstLabelOption extends Omit<SeriesLabelOption, 'rotate' | 'position'> {
    rotate?: 'radial' | 'tangential' | number;
    minAngle?: number;
    silent?: boolean;
    position?: SeriesLabelOption['position'] | 'outside';
}
interface ExtraStateOption$9 {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'] | 'descendant' | 'ancestor';
    };
}
interface SunburstStateOption {
    itemStyle?: SunburstItemStyleOption;
    label?: SunburstLabelOption;
}
interface SunburstSeriesLevelOption extends SunburstStateOption, StatesOptionMixin<SunburstStateOption> {
    highlight?: {
        itemStyle?: SunburstItemStyleOption;
        label?: SunburstLabelOption;
    };
}
interface SortParam {
    dataIndex: number;
    depth: number;
    height: number;
    getValue(): number;
}
interface SunburstSeriesOption extends SeriesOption<SunburstStateOption, ExtraStateOption$9>, SunburstStateOption, CircleLayoutOptionMixin {
    type?: 'sunburst';
    clockwise?: boolean;
    startAngle?: number;
    minAngle?: number;
    stillShowZeroSum?: boolean;
    nodeClick?: 'rootToNode' | 'link';
    renderLabelForZeroData?: boolean;
    levels?: SunburstSeriesLevelOption[];
    animationType?: 'expansion' | 'scale';
    sort?: 'desc' | 'asc' | ((a: SortParam, b: SortParam) => number);
}

declare const ICON_TYPES: readonly ["rect", "polygon", "lineX", "lineY", "keep", "clear"];
declare type IconType = typeof ICON_TYPES[number];
interface ToolboxBrushFeatureOption extends ToolboxFeatureOption {
    type?: IconType[];
    icon?: {
        [key in IconType]?: string;
    };
    title?: {
        [key in IconType]?: string;
    };
}

interface ToolboxDataViewFeatureOption extends ToolboxFeatureOption {
    readOnly?: boolean;
    optionToContent?: (option: ECUnitOption) => string | HTMLElement;
    contentToOption?: (viewMain: HTMLDivElement, oldOption: ECUnitOption) => ECUnitOption;
    icon?: string;
    title?: string;
    lang?: string[];
    backgroundColor?: ColorString;
    textColor?: ColorString;
    textareaColor?: ColorString;
    textareaBorderColor?: ColorString;
    buttonColor?: ColorString;
    buttonTextColor?: ColorString;
}

declare const ICON_TYPES$1: readonly ["zoom", "back"];
declare type IconType$1 = typeof ICON_TYPES$1[number];
interface ToolboxDataZoomFeatureOption extends ToolboxFeatureOption {
    type?: IconType$1[];
    icon?: {
        [key in IconType$1]?: string;
    };
    title?: {
        [key in IconType$1]?: string;
    };
    filterMode?: 'filter' | 'weakFilter' | 'empty' | 'none';
    xAxisIndex?: ModelFinderIndexQuery;
    yAxisIndex?: ModelFinderIndexQuery;
    xAxisId?: ModelFinderIdQuery;
    yAxisId?: ModelFinderIdQuery;
    brushStyle?: ItemStyleOption;
}

declare const ICON_TYPES$2: readonly ["line", "bar", "stack"];
declare const TITLE_TYPES: readonly ["line", "bar", "stack", "tiled"];
declare type IconType$2 = typeof ICON_TYPES$2[number];
declare type TitleType = typeof TITLE_TYPES[number];
interface ToolboxMagicTypeFeatureOption extends ToolboxFeatureOption {
    type?: IconType$2[];
    icon?: {
        [key in IconType$2]?: string;
    };
    title?: {
        [key in TitleType]?: string;
    };
    option?: {
        [key in IconType$2]?: SeriesOption;
    };
    seriesIndex?: {
        line?: number;
        bar?: number;
    };
}

interface ToolboxRestoreFeatureOption extends ToolboxFeatureOption {
    icon?: string;
    title?: string;
}

interface ToolboxSaveAsImageFeatureOption extends ToolboxFeatureOption {
    icon?: string;
    title?: string;
    type?: 'png' | 'jpg';
    backgroundColor?: ZRColor;
    connectedBackgroundColor?: ZRColor;
    name?: string;
    excludeComponents?: string[];
    pixelRatio?: number;
    lang?: string[];
}

declare type MarkerStatisticType = 'average' | 'min' | 'max' | 'median';
interface MarkerPositionOption {
    x?: number | string;
    y?: number | string;
    coord?: (ScaleDataValue | MarkerStatisticType)[];
    xAxis?: ScaleDataValue;
    yAxis?: ScaleDataValue;
    radiusAxis?: ScaleDataValue;
    angleAxis?: ScaleDataValue;
    type?: MarkerStatisticType;
    valueIndex?: number;
    valueDim?: string;
    value?: string | number;
}
interface MarkerOption extends ComponentOption, AnimationOptionMixin {
    silent?: boolean;
    data?: unknown[];
    tooltip?: CommonTooltipOption<unknown> & {
        trigger?: 'item' | 'axis' | boolean | 'none';
    };
}

interface MarkAreaStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface MarkAreaDataItemOptionBase extends MarkAreaStateOption, StatesOptionMixin<MarkAreaStateOption> {
    name?: string;
}
interface MarkArea1DDataItemOption extends MarkAreaDataItemOptionBase {
    xAxis?: number;
    yAxis?: number;
    type?: MarkerStatisticType;
    valueIndex?: number;
    valueDim?: string;
}
interface MarkArea2DDataItemDimOption extends MarkAreaDataItemOptionBase, MarkerPositionOption {
}
declare type MarkArea2DDataItemOption = [MarkArea2DDataItemDimOption, MarkArea2DDataItemDimOption];
interface MarkAreaOption extends MarkerOption, MarkAreaStateOption, StatesOptionMixin<MarkAreaStateOption> {
    precision?: number;
    data?: (MarkArea1DDataItemOption | MarkArea2DDataItemOption)[];
}

declare const TRANSFORM_PROPS$1: {
    readonly x: 1;
    readonly y: 1;
    readonly scaleX: 1;
    readonly scaleY: 1;
    readonly originX: 1;
    readonly originY: 1;
    readonly rotation: 1;
};
declare type TransformProp$1 = keyof typeof TRANSFORM_PROPS$1;
interface GraphicComponentBaseElementOption extends Partial<Pick<Element, TransformProp$1 | 'silent' | 'ignore' | 'draggable' | 'textConfig' | 'onclick' | 'ondblclick' | 'onmouseover' | 'onmouseout' | 'onmousemove' | 'onmousewheel' | 'onmousedown' | 'onmouseup' | 'oncontextmenu' | 'ondrag' | 'ondragstart' | 'ondragend' | 'ondragenter' | 'ondragleave' | 'ondragover' | 'ondrop'>>, Partial<Pick<BoxLayoutOptionMixin, 'left' | 'right' | 'top' | 'bottom'>> {
    type?: string;
    id?: OptionId;
    name?: string;
    parentId?: OptionId;
    parentOption?: GraphicComponentElementOption;
    children?: GraphicComponentElementOption[];
    hv?: [boolean, boolean];
    bounding?: 'raw' | 'all';
    info?: GraphicExtraElementInfo;
    textContent?: GraphicComponentTextOption;
    textConfig?: ElementTextConfig;
    $action?: 'merge' | 'replace' | 'remove';
}
interface GraphicComponentDisplayableOption extends GraphicComponentBaseElementOption, Partial<Pick<Displayable, 'zlevel' | 'z' | 'z2' | 'invisible' | 'cursor'>> {
    style?: ZRStyleProps;
}
interface GraphicComponentGroupOption extends GraphicComponentBaseElementOption {
    type?: 'group';
    width?: number;
    height?: number;
    children: GraphicComponentElementOption[];
}
interface GraphicComponentZRPathOption extends GraphicComponentDisplayableOption {
    shape?: PathProps['shape'];
}
interface GraphicComponentImageOption extends GraphicComponentDisplayableOption {
    type?: 'image';
    style?: ImageStyleProps;
}
interface GraphicComponentTextOption extends Omit<GraphicComponentDisplayableOption, 'textContent' | 'textConfig'> {
    type?: 'text';
    style?: TextStyleProps;
}
declare type GraphicComponentElementOption = GraphicComponentGroupOption | GraphicComponentZRPathOption | GraphicComponentImageOption | GraphicComponentTextOption;
declare type GraphicExtraElementInfo = Dictionary<unknown>;
declare type GraphicComponentLooseOption = GraphicComponentOption | GraphicComponentElementOption;
interface GraphicComponentOption extends ComponentOption {
    elements?: GraphicComponentElementOption[];
}

interface MarkLineStateOption {
    lineStyle?: LineStyleOption;
    itemStyle?: ItemStyleOption;
    label?: SeriesLineLabelOption;
}
interface MarkLineDataItemOptionBase extends MarkLineStateOption, StatesOptionMixin<MarkLineStateOption> {
    name?: string;
}
interface MarkLine1DDataItemOption extends MarkLineDataItemOptionBase {
    xAxis?: number;
    yAxis?: number;
    type?: MarkerStatisticType;
    valueIndex?: number;
    valueDim?: string;
    symbol?: string[] | string;
    symbolSize?: number[] | number;
}
interface MarkLine2DDataItemDimOption extends MarkLineDataItemOptionBase, SymbolOptionMixin, MarkerPositionOption {
}
declare type MarkLine2DDataItemOption = [MarkLine2DDataItemDimOption, MarkLine2DDataItemDimOption];
interface MarkLineOption extends MarkerOption, MarkLineStateOption, StatesOptionMixin<MarkLineStateOption> {
    symbol?: string[] | string;
    symbolSize?: number[] | number;
    precision?: number;
    data?: (MarkLine1DDataItemOption | MarkLine2DDataItemOption)[];
}

interface MarkPointStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface MarkPointDataItemOption extends MarkPointStateOption, StatesOptionMixin<MarkPointStateOption>, SymbolOptionMixin<CallbackDataParams>, MarkerPositionOption {
    name: string;
}
interface MarkPointOption extends MarkerOption, SymbolOptionMixin<CallbackDataParams>, StatesOptionMixin<MarkPointStateOption>, MarkPointStateOption {
    precision?: number;
    data?: MarkPointDataItemOption[];
}

interface ToolboxFullOptionWithFeatures extends ToolboxOption {
    feature?: {
        brush?: ToolboxBrushFeatureOption;
        dataView?: ToolboxDataViewFeatureOption;
        dataZoom?: ToolboxDataZoomFeatureOption;
        magicType?: ToolboxMagicTypeFeatureOption;
        restore?: ToolboxRestoreFeatureOption;
        saveAsImage?: ToolboxSaveAsImageFeatureOption;
        [key: string]: ToolboxFeatureOption | {
            [key: string]: any;
        };
    };
}
declare type SeriesOption$1 = (LineSeriesOption | BarSeriesOption | ScatterSeriesOption | PieSeriesOption | RadarSeriesOption | MapSeriesOption | TreeSeriesOption | TreemapSeriesOption | GraphSeriesOption | GaugeSeriesOption | FunnelSeriesOption | ParallelSeriesOption | SankeySeriesOption | BoxplotSeriesOption | CandlestickSeriesOption | EffectScatterSeriesOption | LinesSeriesOption | HeatmapSeriesOption | PictorialBarSeriesOption | ThemeRiverSeriesOption | SunburstSeriesOption | CustomSeriesOption) & {
    markArea?: MarkAreaOption;
    markLine?: MarkLineOption;
    markPoint?: MarkPointOption;
    tooltip?: SeriesTooltipOption;
};
interface EChartsFullOption extends ECOption {
    title?: TitleOption | TitleOption[];
    grid?: GridOption | GridOption[];
    polar?: PolarOption | PolarOption[];
    geo?: GeoOption | GeoOption[];
    angleAxis?: AngleAxisOption | AngleAxisOption[];
    radiusAxis?: RadiusAxisOption | RadiusAxisOption[];
    xAxis?: CartesianAxisOption | CartesianAxisOption[];
    yAxis?: CartesianAxisOption | CartesianAxisOption[];
    singleAxis?: SingleAxisOption | SingleAxisOption[];
    parallel?: ParallelCoordinateSystemOption | ParallelCoordinateSystemOption[];
    parallelAxis?: ParallelAxisOption | ParallelAxisOption[];
    calendar?: CalendarOption | CalendarOption[];
    toolbox?: ToolboxFullOptionWithFeatures | ToolboxFullOptionWithFeatures[];
    tooltip?: TooltipOption | TooltipOption[];
    axisPointer?: AxisPointerOption | AxisPointerOption[];
    brush?: BrushOption | BrushOption[];
    timeline?: TimelineOption | SliderTimelineOption;
    legend?: LegendOption | ScrollableLegendOption | (LegendOption | ScrollableLegendOption)[];
    dataZoom?: SliderDataZoomOption | InsideDataZoomOption | (SliderDataZoomOption | InsideDataZoomOption)[];
    visualMap?: ContinousVisualMapOption | PiecewiseVisualMapOption | (ContinousVisualMapOption | PiecewiseVisualMapOption)[];
    graphic?: GraphicComponentLooseOption | GraphicComponentLooseOption[];
    series?: SeriesOption$1 | SeriesOption$1[];
    options?: EChartsFullOption[];
    baseOption?: EChartsFullOption;
}

declare type ModelFinder$1 = ModelFinder;
declare const IN_MAIN_PROCESS_KEY: "__flagInMainProcess";
declare const OPTION_UPDATED_KEY: "__optionUpdated";
declare const STATUS_NEEDS_UPDATE_KEY: "__needsUpdateStatus";
declare const CONNECT_STATUS_KEY: "__connectUpdateStatus";
interface SetOptionOpts {
    notMerge?: boolean;
    lazyUpdate?: boolean;
    silent?: boolean;
    replaceMerge?: GlobalModelSetOptionOpts['replaceMerge'];
    transition?: SetOptionTransitionOpt;
}
interface SetOptionTransitionOptItem {
    from?: SetOptionTransitionOptFinder;
    to: SetOptionTransitionOptFinder;
    dividingMethod: MorphDividingMethod;
}
interface SetOptionTransitionOptFinder extends ModelFinderObject {
    dimension: DimensionLoose;
}
declare type SetOptionTransitionOpt = SetOptionTransitionOptItem | SetOptionTransitionOptItem[];
declare class ECharts extends Eventful {
    id: string;
    group: string;
    private _zr;
    private _dom;
    private _model;
    private _throttledZrFlush;
    private _theme;
    private _locale;
    private _chartsViews;
    private _chartsMap;
    private _componentsViews;
    private _componentsMap;
    private _coordSysMgr;
    private _api;
    private _scheduler;
    private _messageCenter;
    private _pendingActions;
    protected _$eventProcessor: never;
    private _disposed;
    private _loadingFX;
    private _labelManager;
    private [OPTION_UPDATED_KEY];
    private [IN_MAIN_PROCESS_KEY];
    private [CONNECT_STATUS_KEY];
    private [STATUS_NEEDS_UPDATE_KEY];
    constructor(dom: HTMLElement, theme?: string | ThemeOption, opts?: {
        locale?: string | LocaleOption;
        renderer?: RendererType;
        devicePixelRatio?: number;
        useDirtyRect?: boolean;
        width?: number;
        height?: number;
    });
    private _onframe;
    getDom(): HTMLElement;
    getId(): string;
    getZr(): ZRenderType;
    setOption(option: EChartsFullOption, notMerge?: boolean, lazyUpdate?: boolean): void;
    setOption(option: EChartsFullOption, opts?: SetOptionOpts): void;
    private setTheme;
    private getModel;
    getOption(): EChartsFullOption;
    getWidth(): number;
    getHeight(): number;
    getDevicePixelRatio(): number;
    getRenderedCanvas(opts?: {
        backgroundColor?: ZRColor;
        pixelRatio?: number;
    }): HTMLCanvasElement;
    getSvgDataURL(): string;
    getDataURL(opts?: {
        type?: 'png' | 'jpg' | 'svg';
        pixelRatio?: number;
        backgroundColor?: ZRColor;
        excludeComponents?: ComponentMainType[];
    }): string;
    getConnectedDataURL(opts?: {
        type?: 'png' | 'jpg' | 'svg';
        pixelRatio?: number;
        backgroundColor?: ZRColor;
        connectedBackgroundColor?: ZRColor;
        excludeComponents?: string[];
    }): string;
    convertToPixel(finder: ModelFinder$1, value: ScaleDataValue): number;
    convertToPixel(finder: ModelFinder$1, value: ScaleDataValue[]): number[];
    convertFromPixel(finder: ModelFinder$1, value: number): number;
    convertFromPixel(finder: ModelFinder$1, value: number[]): number[];
    containPixel(finder: ModelFinder$1, value: number[]): boolean;
    getVisual(finder: ModelFinder$1, visualType: string): string | number | number[] | PatternObject | LinearGradientObject | RadialGradientObject;
    private getViewOfComponentModel;
    private getViewOfSeriesModel;
    private _initEvents;
    isDisposed(): boolean;
    clear(): void;
    dispose(): void;
    resize(opts?: {
        width?: number | 'auto';
        height?: number | 'auto';
        silent?: boolean;
    }): void;
    showLoading(cfg?: object): void;
    showLoading(name?: string, cfg?: object): void;
    hideLoading(): void;
    makeActionFromEvent(eventObj: ECEvent): Payload;
    dispatchAction(payload: Payload, opt?: boolean | {
        silent?: boolean;
        flush?: boolean | undefined;
    }): void;
    updateLabelLayout(): void;
    appendData(params: {
        seriesIndex: number;
        data: any;
    }): void;
    private static internalField;
}
declare function init(dom: HTMLElement, theme?: string | object, opts?: {
    renderer?: RendererType;
    devicePixelRatio?: number;
    width?: number;
    height?: number;
    locale?: string | LocaleOption;
}): ECharts;
declare function connect(groupId: string | ECharts[]): string;
declare function disConnect(groupId: string): void;
declare function dispose(chart: ECharts | HTMLElement | string): void;
declare function getInstanceByDom(dom: HTMLElement): ECharts;
declare function getInstanceById(key: string): ECharts;
declare function registerTheme(name: string, theme: ThemeOption): void;
declare function registerMap(mapName: Parameters<typeof _default$1.registerMap>[0], geoJson: Parameters<typeof _default$1.registerMap>[1], specialAreas?: Parameters<typeof _default$1.registerMap>[2]): void;
declare function getMap(mapName: string): {
    geoJson: any;
    specialAreas: GeoSpecialAreas;
};

export { EChartsFullOption as EChartsOption, connect, disConnect, dispose, getInstanceByDom, getInstanceById, getMap, init, registerLocale, registerMap, registerTheme };
