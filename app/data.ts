export interface DonationItem {
  id: string;
  name: string;
  category: string;
  day: string;
  meal: string;
  donated: boolean;
  donorName: string;
  donorPhone?: string;
  donorObs?: string;
  donationDate?: string;
  donationType?: string;
  pixFile?: string;
}

export const donationItems: DonationItem[] = [
  // SEXTA-FEIRA - 06/02 - Caldo de milho
  { id: 'sex-milho-1', name: 'Duas mãos de milho', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-2', name: '5 kg de peito de frango', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-3', name: '2 litros de óleo', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-4', name: '3 molhos de cebolinha', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-5', name: '2 bandejas de pimenta-de-cheiro', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-6', name: '2 pacotes de Sazón sabor frango', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-7', name: '100 g de açafrão', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-8', name: '200 g de alho', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-9', name: '2 kg de cebola', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },
  { id: 'sex-milho-10', name: '100 g de pimenta-do-reino', category: 'Caldo de milho', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '', donorPhone: '', donorObs: '', donationDate: '' },

  // SEXTA-FEIRA - 06/02 - Caldo de mandioca
  { id: 'sex-mand-1', name: '10 kg de mandioca', category: 'Caldo de mandioca', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '' },
  { id: 'sex-mand-2', name: '3 kg de costela', category: 'Caldo de mandioca', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '' },
  { id: 'sex-mand-3', name: '2 kg de carne (acém ou músculo)', category: 'Caldo de mandioca', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '' },
  { id: 'sex-mand-4', name: '100 g de colorau', category: 'Caldo de mandioca', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '' },
  { id: 'sex-mand-5', name: '100 g de pimenta-do-reino', category: 'Caldo de mandioca', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '' },
  { id: 'sex-mand-6', name: '2 pacotes de Sazón sabor costela', category: 'Caldo de mandioca', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '' },
  { id: 'sex-mand-7', name: '2 kg de cebola', category: 'Caldo de mandioca', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '' },
  { id: 'sex-mand-8', name: '1 kg de sal', category: 'Caldo de mandioca', day: 'Sexta-feira 06/02', meal: 'Noite de Caldos', donated: false, donorName: '' },

  // SÁBADO - 07/02 - Almoço
  { id: 'sab-alm-1', name: '15 kg de arroz', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-2', name: '6 kg de feijão', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-3', name: '30 kg de carne suína (pernil)', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-4', name: '22 kg de batata', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-5', name: '10 litros de leite', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-6', name: '1 kg de margarina', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-7', name: '2 pacotes de Sazón para massa', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-8', name: '8 litros de óleo', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-9', name: '500 g de alho', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-10', name: '4 kg de cebola', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-alm-11', name: '100 g de pimenta-do-reino', category: 'Almoço', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },

  // SÁBADO - 07/02 - Salada
  { id: 'sab-sal-1', name: '5 cabeças de repolho grande', category: 'Salada', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-sal-2', name: '10 kg de tomate', category: 'Salada', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-sal-3', name: '3 molhos de cebolinha', category: 'Salada', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-sal-4', name: '12 limões', category: 'Salada', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'sab-sal-5', name: '1 vidro de azeite', category: 'Salada', day: 'Sábado 07/02', meal: 'Almoço', donated: false, donorName: '' },

  // SÁBADO - 07/02 - Jantar (Noite de Massas)
  { id: 'sab-jan-1', name: '10 kg de espaguete', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-2', name: '10 kg de macarrão (outro tipo)', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-3', name: '12 kg de carne moída', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-4', name: '8 kg de filé de peito de frango', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-5', name: '5 kg de extrato de tomate', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-6', name: '10 litros de leite', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-7', name: '1 kg de margarina', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-8', name: '1 kg de amido de milho', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-9', name: '100 g de orégano', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-10', name: '2 pacotes de Sazón para massas', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-11', name: '1 kg de sal', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-12', name: '1 balde de azeitona sem caroço', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-13', name: '4 kg de mussarela', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-14', name: '4 kg de presunto', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-15', name: '1 lata de milho (5 kg)', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-16', name: '2 litros de creme de leite', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-17', name: '2 bandejas de pimenta-de-cheiro', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-18', name: '3 molhos de cebolinha', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-19', name: '500 g de alho', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-20', name: '3 kg de cebola', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-21', name: '4 kg de cebola de cabeça', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },
  { id: 'sab-jan-22', name: '100 g de pimenta-do-reino', category: 'Jantar - Massas', day: 'Sábado 07/02', meal: 'Jantar - Noite de Massas', donated: false, donorName: '' },

  // DOMINGO - 08/02 - Almoço
  { id: 'dom-alm-1', name: '15 kg de arroz', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-2', name: '6 kg de feijão', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-3', name: '2 kg de bacon', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-4', name: '2 kg de linguiça calabresa', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-5', name: '1 kg de farinha de mandioca', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-6', name: '20 kg de filé de peito de frango', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-7', name: '10 litros de leite', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-8', name: '3 litros de creme de leite', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-9', name: '1 kg de amido de milho', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-10', name: '1 kg de margarina', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-11', name: '500 g de alho', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-12', name: '3 kg de cebola', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-13', name: '4 kg de batata palha', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-14', name: '1 kg de sal', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-15', name: '4 litros de óleo', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-16', name: '1 kg de requeijão', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
  { id: 'dom-alm-17', name: '500 g de ketchup', category: 'Almoço', day: 'Domingo 08/02', meal: 'Almoço', donated: false, donorName: '' },
];
