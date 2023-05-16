package com.enjoy.trip.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.enjoy.trip.dto.AttractionInfo;
import com.enjoy.trip.dto.Gugun;
import com.enjoy.trip.dto.Sido;
import com.enjoy.trip.mapper.AttractionMapper;

@Service
public class AttractionServiceImpl implements AttractionService {
	
	private final AttractionMapper attractionMapper;
	
	public AttractionServiceImpl(AttractionMapper attractionMapper) {
		this.attractionMapper = attractionMapper;
	}

	@Override
	public List<AttractionInfo> selectAttractionList(Map<String, Object> param) throws Exception {
		return attractionMapper.selectAttractionList(param);
	}

	@Override
	public AttractionInfo getAttraction(int contentId) throws Exception {
		return attractionMapper.getAttraction(contentId);
	}

	@Override
	public List<Sido> selectSidoList() throws Exception {
		return attractionMapper.selectSidoList();
	}

	@Override
	public List<Gugun> selectGugun(int sidoCode) throws Exception {
		return attractionMapper.selectGugun(sidoCode);
	}
	
	

}
