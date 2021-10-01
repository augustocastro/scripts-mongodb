const buscar = async (data) => {
  return Ausencia.aggregate([
    { ..._dateToString('inicio') },
    { ..._dateFromString('inicio') },
    { ..._dateToString('fim') },
    { ..._dateFromString('fim') },
    {
      $match: { ...data }
    }
  ]).exec();
}

function _dateToString(field) {
  return {
    $addFields: {
      [field]: {
        $dateToString: {
          "format": "%Y-%m-%d",
          "date": `$${field}`
        }
      }
    }
  }
}

function _dateFromString(field) {
  return {
    $addFields: {
      [field]: {
        $dateFromString: {
          "dateString": `$${field}`,
        }
      }
    }
  }
}
