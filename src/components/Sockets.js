import Rete from 'rete';

const StringSocket = new Rete.Socket("String");
const NumberSocket = new Rete.Socket("Number");

const AnySocket = new Rete.Socket("Any");

AnySocket.combineWith(StringSocket);
AnySocket.combineWith(NumberSocket);

export default { AnySocket };