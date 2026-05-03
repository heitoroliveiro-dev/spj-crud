const API_BASE_URL = import.meta.env.VITE_API_BASE;

/* função que empacota a API e valida se existe resposta ou não */
const request = async (endpoint, options = {}) => {
    const response = await fetch (`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {})
        },
    });

    /* em caso de resposta sem json, retorna objeto vazio */
    const data = await response.json().catch(() => ({}));

    if(!response.ok) {
        throw new Error(data.message || data.error || 'Erro na requisição');
    }

    return data;
}

export const api = {

/********************************
 * PROCESSOS
 *******************************/

/* todos os processos | GET ******/
getProcessos: () => request(`/api/processos`,{
    method: 'GET'
}),

/* detalhes do processo pela id | GET ******/
getProcessoById: (processoId) => request(`/api/processos/${processoId}`,{
    method:'GET',
}),

/* criar novo processo | POST ******/
createProcesso: (payload) => request(`/api/processos`,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
}),

/* atualiza processo | PUT ******/
updateProcesso: (processoId,payload) => request(`/api/processos/${processoId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
}),

/* deleta processo | DELETE ******/
deleteProcesso: (processoId) => request(`/api/processos/${processoId}`,{
    method: 'DELETE',
}),

/********************************
 * ANDAMENTO
 *******************************/

/* andamentos por processo | GET ******/
getAndamentosByProcessos: (processoId) => request(`/api/processos/${processoId}/andamentos`,{
    method: 'GET'
}),

/* cria andamento | POST ******/
createAndamento: (processoId,payload) => request(`/api/processos/${processoId}/andamentos`, {
    method: 'POST',
    headers: {
        'Content-Type':'application/json'
    },
    body: JSON.stringify(payload)
}),

/* andamento por id | GET ******/
getAndamentosById: (andamentoId) => request(`/api/andamentos/${andamentoId}`,{
        method: 'GET',
}),

/* atualiza andamento | PUT ******/
updateAndamento: (andamentoId,payload) => request(`/api/andamentos/${andamentoId}`,{
    method: 'PUT',
    headers: {
        'Content-Type':'application/json'        
    },
    body: JSON.stringify(payload)
}),

/* deleta andamento | DELETE ******/
deleteAndamento: (andamentoId) => request(`/api/andamentos/${andamentoId}`,{
    method: 'DELETE',
}),
}