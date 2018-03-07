'use strict';

var $$Map = require("bs-platform/lib/js/map.js");
var List = require("bs-platform/lib/js/list.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Shape = require("../Types/Shape.js");
var Border = require("../Types/Border.js");
var Generator = require("../Types/Generator.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");

var State = /* module */[];

function F(Board) {
  return (function (Gen) {
      var $$let = Board[/* Coord */0];
      var CoordMap = $$Map.Make([$$let[1]]);
      var create_index_map = function (coords) {
        return $$Array.fold_left((function (param, c) {
                        var i = param[0];
                        return /* tuple */[
                                i + 1 | 0,
                                Curry._3(CoordMap[/* add */3], c, i, param[1])
                              ];
                      }), /* tuple */[
                      0,
                      CoordMap[/* empty */0]
                    ], coords)[1];
      };
      var get_adjacent = function (shape, clist, cmap, i) {
        var coord = Caml_array.caml_array_get(clist, i);
        return List.fold_left((function (adjacents, coord) {
                      var match = Curry._2(CoordMap[/* mem */2], coord, cmap);
                      if (match !== 0) {
                        return /* :: */[
                                Curry._2(CoordMap[/* find */21], coord, cmap),
                                adjacents
                              ];
                      } else {
                        return adjacents;
                      }
                    }), /* [] */0, List.map(Curry._2(Board[/* adjacent_coord */2], shape, coord), Curry._2(Board[/* adjacents */1], shape, coord)));
      };
      var init = function (param, hint_size) {
        var match = Curry._2(Board[/* auto_size */5], /* tuple */[
              param[0],
              param[1]
            ], hint_size);
        var shape = match[0];
        var coords = $$Array.of_list(Curry._1(Board[/* coordinates */4], shape));
        var coord_map = create_index_map(coords);
        var count = coords.length;
        var gen_state = Curry._1(Gen[/* init */4], count);
        var get_adjacent$1 = function (param) {
          return get_adjacent(shape, coords, coord_map, param);
        };
        return /* record */[
                /* count */count,
                /* shape */shape,
                /* scale */match[1],
                /* outsize */match[2],
                /* gen_state */gen_state,
                /* get_adjacent */get_adjacent$1,
                /* coords */coords,
                /* coord_map */coord_map
              ];
      };
      var step = function (state) {
        var newrecord = state.slice();
        newrecord[/* gen_state */4] = Curry._2(Gen[/* step */5], state[/* get_adjacent */5], state[/* gen_state */4]);
        return newrecord;
      };
      var loop_to_end = function (state) {
        var newrecord = state.slice();
        newrecord[/* gen_state */4] = Curry._2(Gen[/* loop_to_end */6], state[/* get_adjacent */5], state[/* gen_state */4]);
        return newrecord;
      };
      var finished = function (param) {
        return Curry._1(Gen[/* finished */7], param[/* gen_state */4]);
      };
      var edges = function (param) {
        return Curry._1(Gen[/* edges */0], param[/* gen_state */4]);
      };
      var max_age = function (param) {
        return param[/* count */0];
      };
      var current_age = function (param) {
        return Curry._1(Gen[/* max_age */2], param[/* gen_state */4]);
      };
      var all_edges = function (param) {
        var coords = param[/* coords */6];
        var scale = param[/* scale */2];
        var shape = param[/* shape */1];
        var to_points = function (param) {
          return /* tuple */[
                  Curry._3(Board[/* tile_center */7], shape, scale, Caml_array.caml_array_get(coords, param[0])),
                  Curry._3(Board[/* tile_center */7], shape, scale, Caml_array.caml_array_get(coords, param[1]))
                ];
        };
        return Curry._3(Generator.PairSet[/* fold */13], (function (pair, coll) {
                      return /* :: */[
                              to_points(pair),
                              coll
                            ];
                    }), Curry._1(Gen[/* edges */0], param[/* gen_state */4]), /* [] */0);
      };
      var all_shapes = function (param) {
        var gen_state = param[/* gen_state */4];
        var scale = param[/* scale */2];
        var shape = param[/* shape */1];
        return $$Array.mapi((function (i, coord) {
                      var offset = Curry._3(Board[/* offset */6], shape, scale, coord);
                      var shape$1 = Curry._2(Board[/* tile_at_coord */8], shape, coord);
                      var visited = Caml_array.caml_array_get(Curry._1(Gen[/* visited */1], gen_state), i);
                      return /* tuple */[
                              Shape.transform(offset, scale, shape$1),
                              visited
                            ];
                    }), param[/* coords */6]);
      };
      var all_walls = function (param) {
        var coord_map = param[/* coord_map */7];
        var coords = param[/* coords */6];
        var scale = param[/* scale */2];
        var shape = param[/* shape */1];
        var edges = Curry._1(Gen[/* edges */0], param[/* gen_state */4]);
        return $$Array.fold_left((function (param, _) {
                        var i = param[0];
                        var coord = Caml_array.caml_array_get(coords, i);
                        var borders = List.map((function (direction) {
                                return Border.transform(scale, Curry._3(Board[/* offset */6], shape, scale, coord), Curry._3(Board[/* direction_to_border */3], shape, coord, direction));
                              }), List.filter((function (d) {
                                      var next = Curry._3(Board[/* adjacent_coord */2], shape, coord, d);
                                      if (Curry._2(CoordMap[/* mem */2], next, coord_map)) {
                                        var nexti = Curry._2(CoordMap[/* find */21], next, coord_map);
                                        if (nexti < i) {
                                          return /* false */0;
                                        } else {
                                          return 1 - Curry._2(Generator.PairSet[/* mem */2], /* tuple */[
                                                      i,
                                                      nexti
                                                    ], edges);
                                        }
                                      } else {
                                        return /* true */1;
                                      }
                                    }))(Curry._2(Board[/* adjacents */1], shape, coord)));
                        return /* tuple */[
                                i + 1 | 0,
                                Pervasives.$at(borders, param[1])
                              ];
                      }), /* tuple */[
                      0,
                      /* [] */0
                    ], coords)[1];
      };
      return /* module */[
              /* CoordMap */CoordMap,
              /* create_index_map */create_index_map,
              /* get_adjacent */get_adjacent,
              /* init */init,
              /* step */step,
              /* loop_to_end */loop_to_end,
              /* finished */finished,
              /* edges */edges,
              /* max_age */max_age,
              /* current_age */current_age,
              /* all_edges */all_edges,
              /* all_shapes */all_shapes,
              /* all_walls */all_walls
            ];
    });
}

exports.State = State;
exports.F = F;
/* Generator Not a pure module */