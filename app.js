const presets = {
  'square-star': {
    source: 'M38.01,5.653h526.531c17.905,0,32.422,14.516,32.422,32.422v526.531c0,17.905-14.517,32.422-32.422,32.422H38.01c-17.906,0-32.422-14.517-32.422-32.422V38.075C5.588,20.169,20.104,5.653,38.01,5.653z',
    target: 'M301.113,12.011l99.25,179.996l201.864,38.778L461.706,380.808l25.508,203.958l-186.101-87.287L115.01,584.766l25.507-203.958L0,230.785l201.86-38.778L301.113,12.011z'
  },
  'circle-drop': {
    source: 'M300,10a290,290 0 1,0 0,580a290,290 0 1,0 0,-580z',
    target: 'M300,8C240,110 82,270 82,398c0,120 97,194 218,194s218,-74 218,-194C518,270 360,110 300,8z'
  },
  'diamond-heart': {
    source: 'M300,10L590,300L300,590L10,300z',
    target: 'M300,570C245,520 38,385 38,205C38,90 178,32 300,160C422,32 562,90 562,205C562,385 355,520 300,570z'
  }
};

const sourceInput = document.querySelector('#source-input');
const targetInput = document.querySelector('#target-input');
const morphShape = document.querySelector('#morph-shape');
const sourceShape = document.querySelector('#source-shape');
const targetShape = document.querySelector('#target-shape');
const status = document.querySelector('#status');
let tween = null;

function validPath(path) {
  if (!path.trim() || !/^[Mm]/.test(path.trim())) return false;
  const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  probe.setAttribute('d', path);
  try { return probe.getTotalLength() > 0; } catch { return false; }
}

function applyPaths() {
  const source = sourceInput.value.trim();
  const target = targetInput.value.trim();
  if (!validPath(source) || !validPath(target)) {
    status.textContent = '路径无效：两段内容都必须是可绘制、以 M/m 开头的 SVG path。';
    return false;
  }
  if (tween?.playing) tween.stop();
  sourceShape.setAttribute('d', source);
  targetShape.setAttribute('d', target);
  morphShape.setAttribute('d', source);
  morphShape.style.fill = document.querySelector('#color-input').value;
  document.querySelector('#state-label').textContent = 'READY';
  status.textContent = '路径已应用，可以播放形变。';
  return true;
}

function loadPreset(key) {
  sourceInput.value = presets[key].source;
  targetInput.value = presets[key].target;
  document.querySelectorAll('.preset').forEach(button => button.classList.toggle('active', button.dataset.preset === key));
  applyPaths();
}

document.querySelectorAll('.preset').forEach(button => {
  button.addEventListener('click', () => loadPreset(button.dataset.preset));
});

document.querySelector('#apply-button').addEventListener('click', applyPaths);

document.querySelector('#swap-button').addEventListener('click', () => {
  [sourceInput.value, targetInput.value] = [targetInput.value, sourceInput.value];
  document.querySelectorAll('.preset').forEach(button => button.classList.remove('active'));
  if (applyPaths()) status.textContent = '起始与目标路径已交换。';
});

document.querySelector('#play-button').addEventListener('click', () => {
  if (!applyPaths()) return;
  const yoyo = document.querySelector('#yoyo-input').checked;
  document.querySelector('#state-label').textContent = 'PLAYING';
  status.textContent = 'KUTE.js 正在计算并播放路径插值。';
  tween = KUTE.fromTo('#morph-shape', { path: '#source-shape' }, { path: '#target-shape' }, {
    duration: Number(document.querySelector('#duration-input').value),
    easing: document.querySelector('#easing-input').value,
    yoyo,
    repeat: yoyo ? 1 : 0,
    onComplete: () => {
      document.querySelector('#state-label').textContent = 'DONE';
      status.textContent = yoyo ? '形变及反向返回已完成。' : '形变已完成。';
    }
  }).start();
});

document.querySelector('#color-input').addEventListener('input', event => {
  morphShape.style.fill = event.target.value;
});

document.querySelector('#duration-input').addEventListener('input', event => {
  document.querySelector('#duration-output').textContent = `${event.target.value} ms`;
});

document.querySelector('#export-button').addEventListener('click', () => {
  const clone = document.querySelector('#artboard').cloneNode(true);
  clone.querySelector('#source-shape')?.remove();
  clone.querySelector('#target-shape')?.remove();
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const visible = clone.querySelector('#morph-shape');
  visible.removeAttribute('style');
  visible.setAttribute('fill', document.querySelector('#color-input').value);
  const content = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
  const url = URL.createObjectURL(new Blob([content], { type: 'image/svg+xml' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'morphcraft-shape.svg';
  link.click();
  URL.revokeObjectURL(url);
  status.textContent = '当前画面已导出为 morphcraft-shape.svg。';
});

loadPreset('square-star');
