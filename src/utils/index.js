/* eslint-disable camelcase */

const mapDBToModel = ({
  id,
  classification,
  confidence,
  created_at,
  owner,
  fileUrl,
}) => ({
  id,
  classification,
  confidence,
  createdAt: created_at,
  owner,
  fileUrl,
});

module.exports = { mapDBToModel };
