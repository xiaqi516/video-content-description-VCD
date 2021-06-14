"""
VCD (Video Content Description) library v4.3.1

Project website: http://vcd.vicomtech.org

Copyright (C) 2021, Vicomtech (http://www.vicomtech.es/),
(Spain) all rights reserved.

VCD is a Python library to create and manage VCD content version 4.3.1.
VCD is distributed under MIT License. See LICENSE.

"""

import inspect
import unittest
import os
import inspect
import vcd.core as core
import vcd.schema as schema
import vcd.types as types


from test_config import check_openlabel
from test_config import openlabel_version_name


class TestBasic(unittest.TestCase):
    def test_create_openlabel(self):
        """
        This test shows how to create a new OpenLABEL object.
        :return:
        """
        openlabel = core.OpenLABEL()
        openlabel.add_object(name="object1", semantic_type="car")
        openlabel.add_object(name="object2", semantic_type="pedestrian")

        # Compare with reference
        self.assertTrue(check_openlabel(openlabel, './etc/' + openlabel_version_name + '_'
                                        + inspect.currentframe().f_code.co_name + '.json'))

    def test_read_vcd431_file(self):
        """
        This test is about reading a VCD431 file and passing it to the OpenLABEL constructor.
        :return:
        """
        openlabel = core.OpenLABEL(file_name='./etc/vcd431_test_contours.json')

        self.assertTrue(check_openlabel(openlabel, './etc/' + openlabel_version_name + '_'
                                        + inspect.currentframe().f_code.co_name + '.json'))

    def test_openlabel_bounding_box_points(self):
        openlabel = core.OpenLABEL()
        uid1 = openlabel.add_object(name="object1", semantic_type="van")
        openlabel.add_object_data(uid=uid1, object_data=types.bbox(
            name="enclosing_rectangle",
            val=[182, 150, 678, 466]))
        openlabel.add_object_data(uid=uid1, object_data=types.poly2d(
            name="extreme_points",
            val=(424, 150, 860, 456, 556, 616, 182, 339),
            mode=types.Poly2DType.MODE_POLY2D_ABSOLUTE,
            closed=True))
        self.assertTrue(check_openlabel(openlabel, './etc/' + openlabel_version_name + '_'
                                        + inspect.currentframe().f_code.co_name + '.json'))

    def test_openlabel_external_data_resource(self):
        openlabel = core.OpenLABEL()
        res_uid = openlabel.add_resource("../resources/xodr/multi_intersections.xodr")
        openlabel.add_object(name="road1", semantic_type="road", res_uid=core.ResourceUID(res_uid, 217))
        openlabel.add_object(name="lane1", semantic_type="lane", res_uid=core.ResourceUID(res_uid, 3))

        self.assertTrue(check_openlabel(openlabel, './etc/' + openlabel_version_name + '_'
                                        + inspect.currentframe().f_code.co_name + '.json'))

    def test_openlabel_tags_complex(self):
        openlabel = core.OpenLABEL()
        openlabel.add_metadata_properties({"tagged_file": "../resources/scenarios/some_scenario_file"})
        openlabel.add_ontology(ontology_name="https://code.asam.net/simulation/standard/openxontology/ontologies/openlabel")

        # We can add a tag
        uid_0 = openlabel.add_tag(semantic_type="double_roundabout", ont_uid="0")
        # and later on, add some data to the tag
        openlabel.add_tag_data(uid=uid_0, tag_data=types.num(name="number_of_entries", val=2))

        uid_1 = openlabel.add_tag(semantic_type="t_intersection", ont_uid="0")
        openlabel.add_tag_data(uid=uid_1, tag_data=types.num(name="number_of_entries", val=3))

        self.assertTrue(check_openlabel(openlabel, './etc/' + openlabel_version_name + '_'
                                        + inspect.currentframe().f_code.co_name + '.json'))

    def test_openlabel_tags_complex_2(self):
        openlabel = core.OpenLABEL()

        ont_uid_0 = openlabel.add_ontology(ontology_name="https://code.asam.net/simulation/standard/openxontology/ontologies/domain/v1",
                                           subset_include=["motorway", "road"],
                                           subset_exclude=["highway", "lane", "curb"])
        ont_uid_1 = openlabel.add_ontology(ontology_name="https://code.asam.net/simulation/standard/openlabel/ontologies/v1")
        ont_uid_2 = openlabel.add_ontology(ontology_name="http://mycompany/ontologies/v1")

        # ODD tags
        uid_0 = openlabel.add_tag(semantic_type="motorway", ont_uid=ont_uid_0)
        uid_1 = openlabel.add_tag(semantic_type="number-of-lanes", ont_uid=ont_uid_0)
        openlabel.add_tag_data(uid=uid_1, tag_data=types.vec(name="values", val=[2, 3]))
        uid_2 = openlabel.add_tag(semantic_type="lane-widths", ont_uid=ont_uid_0)
        openlabel.add_tag_data(uid=uid_2, tag_data=types.vec(name="range1", val=[3.4, 3.7]))
        openlabel.add_tag_data(uid=uid_2, tag_data=types.vec(name="range2", val=[3.9, 4.1]))
        uid_3 = openlabel.add_tag(semantic_type="rainfall", ont_uid=ont_uid_0)
        openlabel.add_tag_data(uid=uid_3, tag_data=types.num(name="min", val=1.2))

        # Behaviour tags
        uid_4 = openlabel.add_tag(semantic_type="walk", ont_uid=ont_uid_1)
        uid_5 = openlabel.add_tag(semantic_type="drive", ont_uid=ont_uid_1)

        # Administrative tags
        uid_6 = openlabel.add_tag(semantic_type="scenario-unique-reference", ont_uid=ont_uid_1)
        openlabel.add_tag_data(uid=uid_6, tag_data=types.text(name="value", val="{02ed611e-a376-11eb-973f-b818cf5bef8c}"))
        uid_7 = openlabel.add_tag(semantic_type="scenario-name", ont_uid=ont_uid_1)
        openlabel.add_tag_data(uid=uid_7, tag_data=types.text(name="value", val="FSD01726287 Roundabout first exit"))
        uid_8 = openlabel.add_tag(semantic_type="adas-feature", ont_uid=ont_uid_1)
        openlabel.add_tag_data(uid=uid_8, tag_data=types.vec(name="values", val=["LCA", "LDW"]))
        uid_9 = openlabel.add_tag(semantic_type="version", ont_uid=ont_uid_1)
        openlabel.add_tag_data(uid=uid_9, tag_data=types.text(name="version", val="1.0.0.0"))
        openlabel.add_tag_data(uid=uid_9, tag_data=types.text(name="date", val="2021-05-25 11:00:00 UTC"))
        uid_10 = openlabel.add_tag(semantic_type="project-id", ont_uid=ont_uid_2)
        openlabel.add_tag_data(uid=uid_10, tag_data=types.vec(name="values", val=[123456]))

        # Custom
        uid_11 = openlabel.add_tag(semantic_type="project-id", ont_uid=ont_uid_2, extends="profile", extends_ontology_id="1", datatype="http://mycompany/datatype/integer")
        uid_12 = openlabel.add_tag(semantic_type="pelican-crossing", ont_uid=ont_uid_2, extends="pedestrian-crossing", extends_ontology_id="0")
        uid_13 = openlabel.add_tag(semantic_type="rain-droplet-size", ont_uid=ont_uid_2, extends="rainfall", extends_ontology_id="0",
                          metrics="http://mycompany/metrics/volume", unit="mm3")

        self.assertTrue(check_openlabel(openlabel, './etc/' + openlabel_version_name + '_'
                                        + inspect.currentframe().f_code.co_name + '.json'))


if __name__ == '__main__':  # This changes the command-line entry point to call unittest.main()
    print("Running " + os.path.basename(__file__))
    unittest.main()
