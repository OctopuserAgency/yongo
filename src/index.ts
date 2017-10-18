import Model from './model';
import OneToOne from './decorators/one-to-one';
import OneToMany from './decorators/one-to-many';
import ManyToMany from './decorators/many-to-many';
import ManyToOne from './decorators/many-to-one';
import Path from './decorators/path';
import Field from './decorators/field';
import Yongo from './yongo';

export { Model, ManyToMany, ManyToOne, OneToMany, OneToOne, Path, Field };

export default Yongo;
