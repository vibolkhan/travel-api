const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function normalizePageLimit(page, limit) {
  let p = parseInt(page, 10);
  let l = parseInt(limit, 10);

  if (Number.isNaN(p) || p < 1) p = 1;
  if (Number.isNaN(l) || l < 1) l = DEFAULT_LIMIT;
  if (l > MAX_LIMIT) l = MAX_LIMIT;

  return { page: p, limit: l };
}

async function listWithPagination(model, options = {}) {
  const {
    page = 1,
    limit = DEFAULT_LIMIT,
    where = {},
    order = [['createdAt', 'DESC']],
    attributes,
    include
  } = options;

  const { page: p, limit: l } = normalizePageLimit(page, limit);
  const offset = (p - 1) * l;

  const queryOptions = {
    where,
    order,
    limit: l,
    offset
  };

  if (attributes) {
    queryOptions.attributes = attributes;
  }

  if (include) {
    queryOptions.include = include;
  }

  const { rows, count } = await model.findAndCountAll(queryOptions);

  const totalPages = Math.ceil(count / l) || 1;

  return {
    data: rows,
    pagination: {
      total: count,
      page: p,
      limit: l,
      totalPages,
      hasNextPage: p < totalPages,
      hasPrevPage: p > 1
    }
  };
}

module.exports = {
  listWithPagination
};
