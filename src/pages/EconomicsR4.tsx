import {Economics} from './Economics';
import {R4FinancialCompleteness} from '../components/R4FinancialCompleteness';
import {useAuth} from '../r7/auth';
export function EconomicsR4(){const {session}=useAuth();if(session?.role!=='Admin')return <main className="r7-settings r7-denied" data-testid="r7-economics-redacted"><h1>Restricted economics</h1><p>Your role can access the project without exposing internal costs, margins, commissions or contribution.</p><p>Internal economics are protected by server authorization.</p></main>;return <><Economics/><R4FinancialCompleteness/></>}
