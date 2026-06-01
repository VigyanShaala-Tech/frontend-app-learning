export default function normalizePagination(pagination = {}) {
  return {
    next: pagination.next ?? null,
    previous: pagination.previous ?? null,
    count: pagination.count ?? 0,
    num_pages: pagination.numPages ?? pagination.num_pages ?? 0,
  };
}
