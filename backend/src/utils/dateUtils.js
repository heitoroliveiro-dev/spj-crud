function hojeAoMeioDia() {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 12, 0, 0);
}

function criarDataLocalAoMeioDia(ano, mes, dia) {
    return new Date(ano, mes - 1, dia, 12, 0, 0);
}

function parseDataBrasileiraOuIso(value, nomeCampo = 'Data') {
    if (!value) {
        const error = new Error(`${nomeCampo} inválida`);
        error.status = 400;
        throw error;
    }

    const dataTexto = String(value).trim();
    let data;

    const brasileira = dataTexto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const iso = dataTexto.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (brasileira) {
        const [, dia, mes, ano] = brasileira;
        data = criarDataLocalAoMeioDia(Number(ano), Number(mes), Number(dia));
    } else if (iso) {
        const [, ano, mes, dia] = iso;
        data = criarDataLocalAoMeioDia(Number(ano), Number(mes), Number(dia));
    } else {
        data = new Date(dataTexto);
    }

    if (Number.isNaN(data.getTime())) {
        const error = new Error(`${nomeCampo} inválida`);
        error.status = 400;
        throw error;
    }

    const hoje = hojeAoMeioDia();
    return data > hoje ? hoje : data;
}

function normalizarData(value) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0);
}

function dataMenorQue(data, dataComparacao) {
    return normalizarData(data) < normalizarData(dataComparacao);
}

module.exports = {
    parseDataBrasileiraOuIso,
    dataMenorQue,
};
