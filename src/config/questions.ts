import type { Question } from '../lib/types';

export const QUESTIONS: Question[] = [
  {
    id: 'q_sleep',
    category: 'energy',
    label: '昨晩の睡眠はどうだった？',
    options: [
      { value: 2, label: '布団で寝て、まあまあ回復感がある', type: 'a' },
      { value: 1, label: '寝落ちしたが、理由はわかっている', type: 'b' },
      { value: 0, label: '気づいたら寝ていた／起きても回復感がない', type: 'c' },
    ],
  },
  {
    id: 'q_appetite',
    category: 'energy',
    label: '食事に対してどんな感じ？',
    options: [
      { value: 2, label: '食べたいものがある、または普通に食べられる', type: 'a' },
      { value: 1, label: '面倒だが、出されれば食べる／適当に済ませる', type: 'b' },
      { value: 0, label: '食べたいものが浮かばない／食べなくてもいい', type: 'c' },
    ],
  },
  {
    id: 'q_social',
    category: 'direction',
    label: '今日、人と関わることについてどう感じる？',
    options: [
      { value: 2, label: '普通／特に抵抗なし', type: 'a' },
      { value: 1, label: '面倒だが、会えばなんとかなる', type: 'b' },
      { value: 0, label: 'できれば誰とも会いたくない／返信したくない', type: 'c' },
    ],
  },
  {
    id: 'q_motivation',
    category: 'direction',
    label: '今日、何かやりたいことはある？',
    options: [
      { value: 2, label: 'ある（仕事でも趣味でも）', type: 'a' },
      { value: 1, label: 'やらなきゃいけないことはあるが、やりたいことは特にない', type: 'b' },
      { value: 0, label: '何も浮かばない／全部どうでもいい', type: 'c' },
    ],
  },
  {
    id: 'q_body',
    category: 'energy',
    label: '今の身体の感覚は？',
    options: [
      { value: 2, label: '普通に動ける', type: 'a' },
      { value: 1, label: 'だるいが動こうと思えば動ける', type: 'b' },
      { value: 0, label: '身体が重い／起き上がるのがつらい', type: 'c' },
    ],
  },
  {
    id: 'q_self_eval',
    category: 'direction',
    label: '今日一日の自分をどう思う？',
    options: [
      { value: 2, label: 'まあまあやれた／悪くない', type: 'a' },
      { value: 1, label: 'もうちょっとできたはずだが、まあいい', type: 'b' },
      { value: 0, label: 'ダメだった／自分が情けない', type: 'c' },
    ],
  },
];
