#ECSS (Enduring CSS) will be used

http://ecss.io/

##ECSS naming convention

.namespace-ModuleOrComponent_ChildNode-variant {}

- namespace: This is a required part of every selector. The micro-namespace should be all lowercase/train-case. It is typically an abbreviation to denote context or originating logic.

- ModuleOrComponent: This is a upper camel case/pascal case. It should always be preceded by a hyphen character (-).

- ChildNode: This is an optional section of the selector. It should be upper camel case/pascal case and preceded by an underscore (_).

- variant: This is a further optional section of the selector. It should be written all lowercase/train-case.

For example:

.hm-Item_Header {}
.hm-Item_Header-bg1 {} /* Image background 1 */

##ECSS component states

.is-Suspended {}
.is-Live {}
.is-Selected {}
.is-Busy {}

etc.

#CSS Overrides

Should be self contained.

For example:

.ip-Carousel {
    font-size: $text13;
    /* The override is here for when this key-selector sits within a ip-HomeCallouts element */
    .ip-HomeCallouts & {
        font-size: $text15;
    }
}