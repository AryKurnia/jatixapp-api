/* eslint-disable camelcase */

const mapDBToModel = ({
  id,
  classification,
  confidence,
  created_at,
  owner,
}) => ({
  id,
  classification,
  confidence,
  createdAt: created_at,
  owner,
});

module.exports = { mapDBToModel };
