import { CampistaBasicoDTO, FuncionarioBasicoDTO } from './pessoa.dto';

export interface EquipeDTO {
  id: number;
  nome: string;
  tipoEquipe: string;
  cronogramas: any[];
  campistasNaEquipe: CampistaBasicoDTO[];
  funcionariosNaEquipe: FuncionarioBasicoDTO[];
  expanded?: boolean;
}
