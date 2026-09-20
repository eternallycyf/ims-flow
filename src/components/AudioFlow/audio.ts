type AudioNodeLike = AudioNode & {
  frequency?: AudioParam;
  gain?: AudioParam;
  type?: OscillatorType;
  stop?: () => void;
};

let context: AudioContext | null = null;
const nodes = new Map<string, AudioNodeLike>();

function getContext() {
  if (!context) {
    context = new AudioContext();
  }
  return context;
}

export function isRunning() {
  return getContext().state === 'running';
}

export function toggleAudio() {
  const ctx = getContext();
  return isRunning() ? ctx.suspend() : ctx.resume();
}

export function updateAudioNode(id: string, data: Record<string, unknown>) {
  const node = nodes.get(id);
  if (!node) return;

  const target = node as unknown as Record<string, any>;
  Object.entries(data).forEach(([key, val]) => {
    if (target[key] instanceof AudioParam && typeof val === 'number') {
      target[key].value = val;
    } else {
      target[key] = val;
    }
  });
}

export function removeAudioNode(id: string) {
  const node = nodes.get(id);
  if (!node) return;
  node.disconnect();
  node.stop?.();
  nodes.delete(id);
}

export function connect(sourceId: string, targetId: string) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);
  if (!source || !target) return;
  source.connect(target);
}

export function disconnect(sourceId: string, targetId: string) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);
  if (!source || !target) return;
  source.disconnect(target);
}

export function ensureSeedNodes() {
  const ctx = getContext();
  if (!nodes.has('a')) {
    const osc = ctx.createOscillator();
    osc.frequency.value = 220;
    osc.type = 'square';
    osc.start();
    nodes.set('a', osc);
  }
  if (!nodes.has('b')) {
    const volume = ctx.createGain();
    volume.gain.value = 0.5;
    nodes.set('b', volume);
  }
  if (!nodes.has('c')) {
    nodes.set('c', ctx.destination);
  }
}

export function createAudioNode(id: string, type: string, data: Record<string, any>) {
  const ctx = getContext();
  switch (type) {
    case 'osc': {
      const node = ctx.createOscillator();
      node.frequency.value = data.frequency ?? 400;
      node.type = (data.type as OscillatorType) ?? 'sine';
      node.start();
      nodes.set(id, node);
      break;
    }
    case 'volume': {
      const node = ctx.createGain();
      node.gain.value = data.gain ?? 0.5;
      nodes.set(id, node);
      break;
    }
    default:
      break;
  }
}
