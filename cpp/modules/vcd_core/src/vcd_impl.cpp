/*
* VCD (Video Content Description) library v4.3.0
*
* Project website: http://vcd.vicomtech.org
*
* Copyright (C) 2020, Vicomtech (http://www.vicomtech.es/),
* (Spain) all rights reserved.

* VCD is a C++ library to create and manage VCD content version 4.3.0.
* VCD is distributed under MIT License. See LICENSE.
*
*/
#include <fstream>
#include <regex>
#include "vcd_impl.h"

using std::string;

namespace vcd {

class CoordSys {
};

///////////////////////////////////////////////
// VCD_Impl
///////////////////////////////////////////////
VCD_Impl::VCD_Impl(const std::string& fileName, const bool validation) :
    m_useUUID(false) {
    // Init last uid contanier
    m_lastUIDbyType.resize(ET_size, 0);

    // Init
    if (!fileName.empty()) {
        // Load from file
        std::ifstream file(fileName);
        file >> m_data;
        file.close();
    } else {
        reset();
    }
}

VCD_Impl::~VCD_Impl() {
}

void
VCD_Impl::reset() {
    m_data["vcd"] = json::object();  // = json::object();
    m_data["vcd"]["metadata"] = json::object();
    m_data["vcd"]["metadata"]["schema_version"] = "4.3.0";

    m_lastUIDbyType[ElementType::object] = -1;
    m_lastUIDbyType[ElementType::action] = -1;
    m_lastUIDbyType[ElementType::event] = -1;
    m_lastUIDbyType[ElementType::context] = -1;
    m_lastUIDbyType[ElementType::relation] = -1;

    // this->fis = FrameIntervals(0);  // works
    // this->fis = FrameIntervals({0, 10});  // works
    // this->fis = FrameIntervals({{0, 10}});  // works
    // data["vcd"]["frame_intervals"] = this->fis.get_dict();
}

std::string
VCD_Impl::stringify(const bool pretty) const {
    std::string str;
    if (pretty)
        str = m_data.dump(4);
    else
        str = m_data.dump();
    return str;
}

void
VCD_Impl::save(const std::string& fileName, const bool pretty) const {
    std::string json_string = this->stringify(pretty);
    std::ofstream f(fileName);
    f << json_string;
    f.close();
}

uint32_t
VCD_Impl::add_object(const std::string& name,
                     const std::string& semantic_type) {
//    m_data[name] = { {"currency", "USD"}, {"value", 42.99} };
}

void
VCD_Impl::add_object_data(const uint32_t uid,
                          const types::ObjectData& object_data) {
}

void
VCD_Impl::set_element(const ElementType type, const std::string &name,
                      const std::string &semantic_type,
                      const FrameIntervals &frame_intervals,
                      const UID &uid, const UID &ont_uid,
                      const CoordSys * const coordinate_system,
                      const SetMode set_mode) {
//        fis = frame_intervals
//        if set_mode == SetMode.union:
//            # Union means fusion, we are calling this function to "add" content, not to remove any
//            fis_existing = self.get_element_frame_intervals(element_type, uid.as_str())
//            fis = fis_existing.union(frame_intervals)

    // 0.- Get uid_to_assign
    // note: private functions use UID type for uids
    uid_to_assign = get_uid_to_assign(type, uid);

    // 1.- Set the root entries and frames entries
    set_element_at_root_and_frames(type, name, semantic_type, frame_intervals,
                                   uid_to_assign, ont_uid, coordinate_system);

    return uid_to_assign
}

///////////////////////////////////////////////
// UID
///////////////////////////////////////////////
UID::UID(const int val) {
    this->set(std::to_string(val), val, false);
}

UID::UID(const std::string &val) {
    const std::regex pattern(
                    "[0-9a-fA-F]{8}-"
                    "[0-9a-fA-F]{4}-"
                    "[0-9a-fA-F]{4}-"
                    "[0-9a-fA-F]{4}-"
                    "[0-9a-fA-F]{12}");
    if (val.empty()) {
        this->set("", -1, false);
    } else {
        const bool is_int = val.find_first_not_of("0123456789") == string::npos;
        if (is_int) {
            this->set(val, std::stoi(val), false);
        } else {
            // e.g. 3d4705a6-6a54-4c5c-9f33-bbb21cc5d576
            bool matches_regex = std::regex_match(val, pattern);
            if (matches_regex) {
                this->set(val, -1, true);
            } else {
                throw std::runtime_error(
                            "ERROR: UID string is not integer not UUID.");
            }
        }
    }
}

void UID::set(std::string uidStr, int uidInt, bool isUUID) {
    this->uidStr = uidStr;
    this->uidInt = uidInt;
    this->is_UUID = isUUID;
}

///////////////////////////////////////////////
// FrameIntervals
///////////////////////////////////////////////
FrameIntervals::FrameIntervals(int frameValue) {
    this->fisDict = json::array();
    this->fisDict.push_back({
                                {"frame_start", frameValue},
                                {"frame_end", frameValue}
                            });
    this->fisNum = {{frameValue, frameValue}};
}

FrameIntervals::FrameIntervals(const Tuple& frameValue) {
    this->fisDict = json::array();
    this->fisDict.push_back({
                                {"frame_start", frameValue[0]},
                                {"frame_end", frameValue[1]}
                            });
    this->fisNum = {frameValue};
}

FrameIntervals::FrameIntervals(const ArrayNx2& frameValue) {
    this->fisDict = json::array();
    for (auto it : frameValue)
        this->fisDict.push_back({{"frame_start", it[0]}, {"frame_end", it[1]}});
    this->fisNum = frameValue;
}

bool FrameIntervals::hasFrame(int frameNum) const {
    for (auto fi : this->fisNum) {
        if (fi[0] <= frameNum && frameNum <= fi[1])
            return true;
    }
    return false;
}

};  // namespace vcd
