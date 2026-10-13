// 타임아웃은 응답 본문 읽기까지 포함하고 상위 화면의 요청 취소도 전파합니다.
export async function withRequestTimeout(operation, signal, timeoutMs = 15000) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, timeoutMs);
  try { return await operation(controller.signal); }
  finally { clearTimeout(timer); signal?.removeEventListener("abort", abort); }
}

// 목록 보완 요청을 한꺼번에 쏟아내지 않고 제한된 수로 실행합니다.
export async function forEachConcurrent(items, operation, limit = 4) {
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await operation(items[index], index);
    }
  }));
}
