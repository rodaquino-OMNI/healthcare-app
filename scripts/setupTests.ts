import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-emotion'

configure({ adapter: new Adapter() })
