const PlantUmlCodeGenerator = require('../src');

const str = '@startuml\n\
title Allocation queue - Class Diagram\n\
\n\
class Scheduler {\n\
    +constructor(Queue, Resources)\n\
    -async test(Queue)\n\
    #async protected(Queue)\n\
    \
    #Queue _queue\n\
    #Resources _resoures\n\
}';
const platnuml = PlantUmlCodeGenerator.fromString(str);
               //PlantUmlCodeGenerator.fromFile('/Users/jussiva/git/github/OpenTMI/iot-allocator/doc/architecture.puml')
platnuml.generate()
    .then((out) => out.print());